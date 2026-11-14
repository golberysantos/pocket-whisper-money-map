import { createFileRoute } from "@tanstack/react-router";
import { MinhaCarteira } from "@/components/MinhaCarteira";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minha Carteira — Finanças Pessoais" },
      {
        name: "description",
        content:
          "Controle suas finanças pessoais com assistente inteligente e metas de economia.",
      },
      { property: "og:title", content: "Minha Carteira — Finanças Pessoais" },
      {
        property: "og:description",
        content:
          "Controle suas finanças pessoais com assistente inteligente e metas de economia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return <MinhaCarteira />;
}
