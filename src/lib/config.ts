// Configurações comerciais do Bolso em Dia.
// IMPORTANTE: substitua pelo número real do WhatsApp da empresa
// (código do país + DDD + número, somente dígitos).
export const WHATSAPP_NUMBER = "5511999999999";

// Mensagem genérica de início de conversa — NÃO incluir dados pessoais
// nem respostas do formulário aqui (eles iriam para a URL).
export const WHATSAPP_MESSAGE =
  "Olá! Vim pela página do Bolso em Dia e quero montar meu primeiro plano.";

export function whatsappUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
