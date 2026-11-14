import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bolso em Dia — Organização financeira com acompanhamento" },
      {
        name: "description",
        content:
          "Organize seu dinheiro com um plano simples e acompanhamento pelo WhatsApp. Para quem está começando a organizar as finanças.",
      },
      {
        property: "og:title",
        content: "Bolso em Dia — Organização financeira com acompanhamento",
      },
      {
        property: "og:description",
        content:
          "Organize seu dinheiro com um plano simples e acompanhamento pelo WhatsApp. Para quem está começando a organizar as finanças.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LandingPage,
});
