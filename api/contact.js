const net = require('net');
const tls = require('tls');

const CONTACT_TO = process.env.CONTACT_TO || 'contato@softcasenet.com.br';

function cleanHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function readBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function buildEmailHtml(data) {
  const rows = [
    ['Nome', data.name],
    ['E-mail', data.email],
    ['Telefone / WhatsApp', data.phone],
    ['Empresa', data.company],
    ['Tamanho do estacionamento', data.spots],
    ['Cargo / Funcao', data.role],
    ['Mensagem', data.message || 'Nao informado']
  ];

  return `
    <h2>Novo contato pelo site Softcase</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      ${rows.map(([label, value]) => `
        <tr>
          <th align="left" style="background:#f3f6fb;">${escapeHtml(label)}</th>
          <td>${escapeHtml(value)}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

function buildEmailText(data) {
  return [
    'Novo contato pelo site Softcase',
    '',
    `Nome: ${data.name || ''}`,
    `E-mail: ${data.email || ''}`,
    `Telefone / WhatsApp: ${data.phone || ''}`,
    `Empresa: ${data.company || ''}`,
    `Tamanho do estacionamento: ${data.spots || ''}`,
    `Cargo / Funcao: ${data.role || ''}`,
    `Mensagem: ${data.message || 'Nao informado'}`
  ].join('\n');
}

function createSmtpClient(socket) {
  let buffer = '';
  const waiters = [];

  function onData(chunk) {
    buffer += chunk.toString('utf8');
    flush();
  }

  function flush() {
    if (!waiters.length) return;
    const match = buffer.match(/(?:^|\r?\n)(\d{3}) [^\r\n]*(?:\r?\n|$)/);
    if (!match) return;

    const responseEnd = match.index + match[0].length;
    const response = buffer.slice(0, responseEnd);
    buffer = buffer.slice(responseEnd);
    waiters.shift().resolve(response);
  }

  socket.on('data', onData);

  return {
    socket,
    detach() {
      socket.off('data', onData);
    },
    read() {
      return new Promise((resolve, reject) => {
        waiters.push({ resolve, reject });
        flush();
      });
    },
    async command(line, expectedCode) {
      socket.write(`${line}\r\n`);
      const response = await this.read();
      if (expectedCode && !response.startsWith(String(expectedCode))) {
        throw new Error(`SMTP command failed: ${line}`);
      }
      return response;
    }
  };
}

function connectSocket({ host, port, secure }) {
  return new Promise((resolve, reject) => {
    const socket = secure
      ? tls.connect({ host, port, servername: host }, () => resolve(socket))
      : net.connect({ host, port }, () => resolve(socket));

    socket.setTimeout(15000);
    socket.once('error', reject);
    socket.once('timeout', () => reject(new Error('SMTP connection timed out')));
  });
}

async function sendSmtpMail({ to, subject, text, html, replyTo }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass || !from) {
    const error = new Error('SMTP environment variables are not configured');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  let socket = await connectSocket({ host, port, secure });
  let smtp = createSmtpClient(socket);

  await smtp.read();
  await smtp.command(`EHLO ${host}`, 250);

  if (!secure) {
    await smtp.command('STARTTLS', 220);
    smtp.detach();
    socket = tls.connect({ socket, servername: host });
    await new Promise((resolve, reject) => {
      socket.once('secureConnect', resolve);
      socket.once('error', reject);
    });
    smtp = createSmtpClient(socket);
    await smtp.command(`EHLO ${host}`, 250);
  }

  await smtp.command('AUTH LOGIN', 334);
  await smtp.command(Buffer.from(user).toString('base64'), 334);
  await smtp.command(Buffer.from(pass).toString('base64'), 235);
  await smtp.command(`MAIL FROM:<${from}>`, 250);
  await smtp.command(`RCPT TO:<${to}>`, 250);
  await smtp.command('DATA', 354);

  const boundary = `softcase-${Date.now()}`;
  const message = [
    `From: Softcase Site <${from}>`,
    `To: ${to}`,
    `Reply-To: ${cleanHeader(replyTo)}`,
    `Subject: ${cleanHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
    '',
    `--${boundary}--`
  ].join('\r\n').replace(/^\./gm, '..');

  socket.write(`${message}\r\n.\r\n`);
  const dataResponse = await smtp.read();
  if (!dataResponse.startsWith('250')) throw new Error('SMTP DATA failed');

  await smtp.command('QUIT', 221).catch(() => {});
  socket.end();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await readBody(req);
    const requiredFields = ['name', 'email', 'phone', 'company', 'spots', 'role'];
    const missingField = requiredFields.find((field) => !String(data[field] || '').trim());

    if (missingField) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendSmtpMail({
      to: CONTACT_TO,
      subject: 'Contato pelo site Softcase',
      text: buildEmailText(data),
      html: buildEmailHtml(data),
      replyTo: data.email
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    if (error.code === 'SMTP_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'SMTP_NOT_CONFIGURED', message: 'Envio de e-mail ainda nao configurado no servidor.' });
    }

    return res.status(500).json({ error: 'Could not send contact message' });
  }
};