import { createFileRoute } from "@tanstack/react-router";
import { Cofrinhos } from "@/components/Cofrinhos";

export const Route = createFileRoute("/cofrinhos")({
  head: () => ({
    meta: [
      { title: "Cofrinhos Inteligentes — Bolso em Dia" },
      {
        name: "description",
        content:
          "Crie cofrinhos inteligentes e guarde dinheiro para seus objetivos com a ajuda do assistente financeiro.",
      },
      { property: "og:title", content: "Cofrinhos Inteligentes — Bolso em Dia" },
      {
        property: "og:description",
        content:
          "Crie cofrinhos inteligentes e guarde dinheiro para seus objetivos com a ajuda do assistente financeiro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CofrinhosPage,
});

function CofrinhosPage() {
  return <Cofrinhos />;
}
