import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/AdminPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Bolso em Dia" },
      {
        name: "description",
        content: "Área restrita da equipe Bolso em Dia para acompanhamento de leads e clientes.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel Administrativo — Bolso em Dia" },
      {
        property: "og:description",
        content: "Área restrita da equipe Bolso em Dia para acompanhamento de leads e clientes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return <AdminPanel />;
}
