import { createFileRoute } from "@tanstack/react-router";
import { MinhaCarteira } from "@/components/MinhaCarteira";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Meu Painel — Bolso em Dia" },
      {
        name: "description",
        content:
          "Acompanhe suas receitas, despesas e metas com o assistente financeiro do Bolso em Dia.",
      },
      { property: "og:title", content: "Meu Painel — Bolso em Dia" },
      {
        property: "og:description",
        content:
          "Acompanhe suas receitas, despesas e metas com o assistente financeiro do Bolso em Dia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  return <MinhaCarteira />;
}
