# Roadmap — MVP Bolso em Dia

- [x] Ativar Lovable Cloud (banco + auth)
- [x] Migration: tabela `leads` + `user_roles` + `has_role` + RLS (visitante só cria lead; admin lê/atualiza)
- [x] Landing page pública em `/` (proposta, benefícios, como funciona, FAQ, limites, CTA)
- [x] Formulário de lead com validação + consentimento + abertura de WhatsApp (sem dados na URL)
- [x] Painel admin protegido em `/admin` (login, lista de leads, busca, status, próxima ação, retorno, notas)
- [x] App financeiro movido para `/app` (cofrinhos continuam em `/cofrinhos`)
- [x] Verde da marca migrado para tokens semânticos em styles.css
- [x] Testes manuais no navegador (mobile, validação, WhatsApp, bloqueio do admin, fluxo admin)
- [x] Atualização de segurança dos pacotes TanStack

## Pendências externas (aguardando o usuário)
- Número real do WhatsApp da empresa (placeholder em `src/lib/config.ts`)
- Criar a conta de administrador real em More → Users → Add user e conceder o papel de admin
