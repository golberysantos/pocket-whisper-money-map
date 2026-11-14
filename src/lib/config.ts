// Configurações comerciais do Bolso em Dia.
// Código do país + DDD + número, somente dígitos, conforme informado.
export const WHATSAPP_NUMBER = "559291147485";

// Mensagem genérica de início de conversa — NÃO incluir dados pessoais
// nem respostas do formulário aqui (eles iriam para a URL).
export const WHATSAPP_MESSAGE =
  "Olá! Vim pela página do Bolso em Dia e quero montar meu primeiro plano.";

export function whatsappUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
