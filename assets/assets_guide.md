# Guia de Integração de Assets - Softcase

Este guia documenta o mapeamento das imagens copiadas da pasta original (`SiteSoftcase/public/Imagens`) para a estrutura do novo site em (`Site2026/assets/images`), permitindo que você saiba exatamente onde cada foto está sendo exibida no layout final.

## Mapeamento de Arquivos e Seções

Todas as imagens foram copiadas automaticamente para a pasta [assets/images/](file:///c:/Users/abraz/OneDrive/projetos/Site2026/assets/images/). O site institucional utiliza-as conforme descrito abaixo:

### 1. Identidade Visual e Logotipo
* **`logo_softcase.png`**
  * *Onde é usado:* Navbar principal (cabeçalho) e rodapé do site.
  * *Visual:* Versão clara/padrão do logo Softcase para fundo escuro.
* **`logo_softcase_dark.png`**
  * *Onde é usado:* Favicon do site (ícone exibido na aba do navegador).

### 2. Seção de Produtos (Tabs Interativas)
Cada aba do mostruário de produtos utiliza uma imagem correspondente às soluções oficiais:
* **Aba "Softpark Automação"**
  * *Imagem:* `softpark_fit.png`
  * *Visual:* Totem preto receptor/emissor de tickets com o logo "Softpark".
* **Aba "ERPCase"**
  * *Imagem:* `Imagem1Home.png`
  * *Visual:* Painel gerencial e interface de controle comercial.
* **Aba "ParkVision360"**
  * *Imagem:* `hero-premium.png`
  * *Visual:* Painéis e estatísticas de controle gerencial corporativo.
* **Aba "Softpark Mobile"**
  * *Imagem:* `novo_estacionamento.png`
  * *Visual:* Fluxo de pista e guarita com o sistema operacional móvel.
* **Aba "SoftPay Autoatendimento"**
  * *Imagem:* `autopagamento_user.png`
  * *Visual:* Totem branco de autoatendimento touch com uma cliente realizando o pagamento do ticket.
* **Aba "SoftRPS"**
  * *Imagem:* `varejo_lojas.png`
  * *Visual:* Fluxo fiscal e integração de pistas comerciais.
* **Aba "ParkFlow"**
  * *Imagem:* `modernizar_operacao.png`
  * *Visual:* Organização de fluxo de veículos e pátio.
* **Aba "SoftAuditor"**
  * *Imagem:* `grandes_redes.png`
  * *Visual:* Auditoria de pátio em redes de alta complexidade.

### 3. Simulador IA ParkVision360 (Ciclo de Reconhecimento LPR)
O simulador interativo na seção do ParkVision360 altera a imagem de fundo e as coordenadas do quadro LPR dinamicamente a cada 5 segundos para simular a detecção em tempo real:
* **Ciclo 1 (Entrada de Mensalista):**
  * *Imagem:* `lpr_estacionamento.jpg` (Carro prata Virtus em frente ao totem com a placa `FEG-7623`).
* **Ciclo 2 (Ticket de Visitante):**
  * *Imagem:* `hero-real.png` (Terminal de entrada com indicação de placa no display).
* **Ciclo 3 (Cancelas e Saídas):**
  * *Imagem:* `cancelas_detalhe.jpg` (Detalhe da cancela de liberação de pista).
* **Ciclo 4 (Segundo Acesso):**
  * *Imagem:* `cancelas_detalhe_v2.jpg` (Visão aproximada das cancelas automáticas).

---

## Como Atualizar ou Substituir Imagens
Caso queira substituir alguma imagem por uma versão mais recente ou otimizada:
1. Salve a nova imagem com o **mesmo nome e extensão** listados acima.
2. Salve-a na pasta `c:\Users\abraz\OneDrive\projetos\Site2026\assets\images\`.
3. Limpe o cache do navegador e recarregue o site para ver as atualizações.
