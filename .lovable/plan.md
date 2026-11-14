# Plano: MVP "Bolso em Dia"

Transformar o app atual (Minha Carteira) no MVP comercial descrito no README: landing page pública, formulário de leads, abertura de conversa no WhatsApp e painel administrativo protegido. A funcionalidade de cofrinhos/metas existente é preservada.

## O que será construído

### 1. Landing page pública (nova rota `/`)
- Proposta clara: organização financeira para iniciantes, em pt-BR, linguagem simples e acolhedora.
- Seções: para quem é, benefícios, como funciona, perguntas frequentes, limites do serviço (sem consultoria de investimento, sem promessa de resultado, sem movimentação de dinheiro).
- CTA "Montar meu primeiro plano" levando ao formulário.
- Responsiva, com navegação por teclado e contraste legível.

### 2. Formulário de lead (na landing, âncora ou seção própria)
- Campos: nome, WhatsApp, principal objetivo, consentimento explícito de contato (checkbox obrigatório).
- Validação com mensagens claras e rótulos acessíveis; estados de sucesso/erro.
- Não pede senha bancária, saldo detalhado nem documentos.
- Ao enviar: salva o lead no banco e abre o WhatsApp da empresa (número configurável) com mensagem genérica pré-preenchida — sem dados pessoais na URL.

### 3. Painel administrativo (`/admin`, protegido)
- Login por e-mail/senha via Lovable Cloud; visitante não acessa nem consulta o painel.
- Lista de leads/clientes com busca, status (novo, em conversa, cliente, encerrado), próxima ação, data de retorno e notas.
- Administrador consegue localizar um lead, alterar status e registrar retorno.

### 4. Backend (Lovable Cloud)
- Ativar o Lovable Cloud (banco + autenticação).
- Tabela `leads`: nome, whatsapp, objetivo, consentimento, status, próxima ação, data de retorno, notas, timestamps.
- Regras de acesso: visitante só pode **criar** lead (nunca ler); apenas administrador autenticado lê/atualiza.
- Tabela de papéis para identificar o administrador.

### 5. Preservação do app financeiro
- O painel "Minha Carteira" e os Cofrinhos Inteligentes continuam disponíveis em `/app` e `/cofrinhos`, sem mudanças de comportamento.

## Fora de escopo (conforme README)
- Cobrança/pagamentos, conexão bancária, recomendação de investimento, chatbot no WhatsApp, alertas por e-mail.

## Configuração externa necessária
- Número de WhatsApp da empresa (salvo como configuração/segredo do projeto).
- Conta de administrador criada após a ativação do Cloud.

## Verificação antes de concluir
- Teste manual no navegador: envio do formulário pelo celular (viewport móvel), mensagens de validação, abertura do WhatsApp sem dados pessoais no link, bloqueio do `/admin` para visitante, e fluxo do administrador (buscar lead, mudar status, registrar retorno).

## Detalhes técnicos
- Stack atual: TanStack Start + React 19 + Tailwind v4 (tokens semânticos em `src/styles.css`).
- Novas rotas: `src/routes/index.tsx` (landing), `src/routes/app.tsx` (app atual), `src/routes/admin.tsx` + layout autenticado.
- Dados iniciais do painel: apenas dados fictícios em demonstração; nunca dados reais no painel público.
- Cores da marca: manter o verde já usado no app como cor primária, migrado para tokens semânticos.
