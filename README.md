# Bolso em Dia — organização financeira com acompanhamento

Serviço digital de organização financeira para iniciantes: landing page pública, formulário de contato, fechamento humano pelo WhatsApp e painel administrativo de acompanhamento. A aplicação financeira anterior (Minha Carteira) segue disponível como área do cliente em `/app` e `/cofrinhos`.

- **Aplicação publicada:** https://pocket-whisper-money-map.lovable.app
- **Idioma:** português do Brasil
- **Backend:** Lovable Cloud (banco de dados + autenticação)

## A ideia e a dor

Muita gente quer organizar o orçamento, mas abandona aplicativos que exigem registros frequentes, categorias difíceis de entender e disciplina para acompanhar metas. O problema que queremos validar é mais específico: **pessoas iniciantes precisam de um primeiro plano simples e de acompanhamento leve para manter o hábito de organização financeira**.

O Bolso em Dia propõe um serviço com linguagem simples, metas visuais e acompanhamento periódico. A pessoa conhece a proposta, responde a um formulário curto e conversa pelo WhatsApp para tirar dúvidas e contratar. O MVP não movimenta dinheiro, não conecta contas bancárias e não promete resultados financeiros.

### Por que pode valer um negócio

- A dificuldade é recorrente, não uma tarefa pontual: o acompanhamento pode justificar uma assinatura.
- O onboarding e o fechamento são feitos manualmente, sem construir pagamentos ou automações antes de validar a procura.
- A aplicação financeira já existente (painel e cofrinhos) é reaproveitada como parte do produto.
- A hipótese comercial só será considerada validada após conversas e pagamentos reais; a existência do app não prova disposição a pagar.

## O que já está implementado

### Landing page — `/`

Página pública, responsiva e navegável por teclado, com: proposta no topo, "Para quem é", "Como funciona" (3 passos), seção de transparência com os limites do serviço, perguntas frequentes (preço, segurança dos dados, necessidade de instalar app, indicação de investimentos), formulário de contato e rodapé. O CTA "Montar meu primeiro plano" leva direto ao formulário.

### Formulário de leads — seção `#formulario` na landing

- Campos: **nome**, **WhatsApp**, **principal objetivo** (Sair das dívidas, Criar uma reserva de emergência, Guardar dinheiro para um objetivo, Organizar o orçamento do mês, Outro) e **consentimento explícito** de contato (caixa obrigatória).
- Validação com mensagens claras em cada campo, rótulos acessíveis e estados de envio, sucesso e erro.
- Não pede senha de banco, saldo detalhado nem documentos.
- Ao enviar: o lead é salvo no banco e o WhatsApp da empresa abre com uma mensagem genérica de início de conversa. Nenhuma resposta do formulário vai para a URL.
- Número configurado em `src/lib/config.ts`: **55 92 91147485**, com teste cobrindo o número e a ausência de dados pessoais no link (`src/lib/config.test.js`).

### Painel administrativo — `/admin`

- Protegido por login com e-mail e senha via Lovable Cloud. Visitante não abre nem consulta o painel.
- A permissão é verificada pela função `has_role`: quem não é administrador vê "Acesso restrito", com opção de sair da conta.
- Lista de leads e clientes com busca por nome, WhatsApp ou objetivo.
- Status: **Novo**, **Em conversa**, **Cliente**, **Encerrado**.
- Cada registro tem próxima ação, data de retorno, notas do que foi combinado e data de recebimento; o administrador edita tudo pela caixa "Editar".
- Sair da conta limpa os dados em memória e volta para a página inicial.

### Área do cliente — `/app` e `/cofrinhos`

- `/app` — painel financeiro (receitas, despesas e metas) da versão anterior, mantido como área do cliente.
- `/cofrinhos` — cofrinhos inteligentes para guardar dinheiro por objetivo.
- Nenhuma das duas telas foi modificada no MVP comercial.

## Dados, acesso e limites

| Tabela | Para que serve | Quem acessa |
|---|---|---|
| `leads` | Nome, WhatsApp, objetivo, consentimento, status, próxima ação, data de retorno, notas e datas de criação/atualização | Visitante só **cria** (nunca lê); administrador **lê, atualiza e exclui** |
| `user_roles` | Papéis de cada conta (ex.: `admin`) | Sem acesso pela interface pública; a verificação é feita pela função `has_role` |

- Formulários enviados pela página inicial aparecem no painel sem necessidade de aprovação manual.
- A conta administrativa ativa é **golbery.santos@yahoo.com.br**.
- Dados financeiros são sensíveis: o MVP coleta o mínimo necessário e restringe o painel.

## Fora de escopo (decisão do MVP)

Cobrança e pagamentos integrados, conexão bancária, recomendação de investimento, chatbot no WhatsApp e alertas por e-mail. O fechamento continua humano; eventual pagamento é combinado na conversa, por meio externo.

## Fluxo que o MVP entrega

1. A landing page explica para quem é o serviço, o que oferece e o que **não** oferece.
2. O formulário coleta nome, WhatsApp, objetivo e consentimento explícito.
3. Após o envio, o WhatsApp abre com mensagem pré-preenchida, sem dados sensíveis na URL.
4. O painel administrativo registra lead, status, próxima ação, data de retorno e notas.
5. O atendimento e o fechamento continuam humanos; o painel guarda o que foi combinado.

## Sinais a medir no piloto

1. Pessoas que visitam a página e iniciam o formulário.
2. Formulários concluídos e contatos que consentiram em receber retorno.
3. Conversas iniciadas no WhatsApp, objeções e interesse em contratar.
4. Conversão em primeira contratação e permanência após o primeiro ciclo.

## Hipóteses ainda em aberto

- **Preço:** ainda não definido; combinado na conversa.
- **TAM/SAM/SOM:** sem fontes coletadas. Devem ser estimados bottom-up (população elegível × preço, parte alcançável do canal digital, leads qualificados × conversão observada) e não podem ser apresentados como dados de mercado comprovados.
- **Público:** adultos no Brasil que querem começar a organizar as finanças, usam celular e preferem linguagem simples a planilhas. A amostra do piloto ainda precisa ser definida por região e canal.
- **Correções:** depois de testar com pessoas reais, registrar cada problema reproduzível e o resultado esperado, e tratar só esses pontos.

## Como rodar

Pré-requisitos: Node.js e npm ([instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone <this-repository-url>
cd pocket-whisper-money-map
npm i
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | App em desenvolvimento no navegador |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build de produção |
| `npm run lint` | Checagem de código |
| `npm run format` | Formatação |
| `bun test` | Testes do projeto (ex.: número do WhatsApp e link de contato) |

O projeto é versionado por completo (código, configuração e dependências), então os comandos acima funcionam em qualquer clone.

### Configuração externa

- **WhatsApp:** número e mensagem de abertura ficam em `src/lib/config.ts`.
- **Administradores:** a conta é criada no Lovable Cloud e recebe o papel `admin` na tabela `user_roles`.
- **Chaves do backend:** geradas e injetadas automaticamente; não é preciso colocar credenciais no código.

## Stack e estrutura

- TanStack Start (React 19) com Vite e TypeScript
- Tailwind CSS v4, com a cor primária verde da marca definida em `src/styles.css`
- Lovable Cloud para banco de dados e autenticação
- Rotas em `src/routes`: `index.tsx` (`/`), `admin.tsx` (`/admin`), `app.tsx` (`/app`), `cofrinhos.tsx` (`/cofrinhos`)
- Componentes principais em `src/components`: `LandingPage`, `AdminPanel`, `MinhaCarteira`, `Cofrinhos`

## Aprendizados e decisões

- A aplicação financeira e os cofrinhos são ativos reutilizáveis, mas não substituem a validação de uma oferta comercial.
- Formulário, fechamento via WhatsApp e acompanhamento manual reduzem o esforço antes de saber se existe demanda.
- Preço, conversão e tamanho de mercado continuam hipóteses; não devem ser apresentados como dados comprovados.
- O painel administrativo é a única área com dados de leads, e o acesso é restrito por papel, não por esconder a página.
