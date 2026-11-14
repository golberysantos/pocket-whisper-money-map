import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CalendarClock,
  Loader2,
  LogOut,
  Pencil,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

const STATUS = [
  { valor: "novo", rotulo: "Novo" },
  { valor: "em_conversa", rotulo: "Em conversa" },
  { valor: "cliente", rotulo: "Cliente" },
  { valor: "encerrado", rotulo: "Encerrado" },
] as const;

const rotuloStatus = (v: string) =>
  STATUS.find((s) => s.valor === v)?.rotulo ?? v;

const corStatus = (v: string) => {
  switch (v) {
    case "novo":
      return "bg-primary/10 text-primary";
    case "em_conversa":
      return "bg-amber-100 text-amber-800";
    case "cliente":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

function LoginForm({ onEntrar }: { onEntrar: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha incorretos. Tente de novo.");
      return;
    }
    onEntrar();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Painel Bolso em Dia</h1>
            <p className="text-xs text-muted-foreground">Acesso restrito à equipe</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 rounded-lg"
              required
            />
          </div>
          <div>
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1.5 h-11 rounded-lg"
              required
            />
          </div>
          {erro && (
            <p role="alert" className="text-sm text-destructive">
              {erro}
            </p>
          )}
          <Button
            type="submit"
            disabled={carregando}
            className="h-11 w-full rounded-lg font-semibold"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function EditarLeadDialog({
  lead,
  aberto,
  onFechar,
  onSalvo,
}: {
  lead: Lead | null;
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const [status, setStatus] = useState(lead?.status ?? "novo");
  const [proximaAcao, setProximaAcao] = useState(lead?.proxima_acao ?? "");
  const [dataRetorno, setDataRetorno] = useState(lead?.data_retorno ?? "");
  const [notas, setNotas] = useState(lead?.notas ?? "");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setProximaAcao(lead.proxima_acao ?? "");
      setDataRetorno(lead.data_retorno ?? "");
      setNotas(lead.notas ?? "");
    }
  }, [lead]);

  const salvar = async () => {
    if (!lead) return;
    setSalvando(true);
    const { error } = await supabase
      .from("leads")
      .update({
        status,
        proxima_acao: proximaAcao || null,
        data_retorno: dataRetorno || null,
        notas: notas || null,
      })
      .eq("id", lead.id);
    setSalvando(false);
    if (error) {
      toast.error("Não foi possível salvar. Tente de novo.");
      return;
    }
    toast.success("Lead atualizado.");
    onSalvo();
    onFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Editar lead — {lead?.nome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="edit-status" className="mt-1.5 w-full rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => (
                  <SelectItem key={s.valor} value={s.valor}>
                    {s.rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-proxima-acao">Próxima ação</Label>
            <Input
              id="edit-proxima-acao"
              value={proximaAcao}
              onChange={(e) => setProximaAcao(e.target.value)}
              placeholder="Ex: enviar proposta, agendar check-in"
              className="mt-1.5 rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="edit-data-retorno">Data de retorno</Label>
            <Input
              id="edit-data-retorno"
              type="date"
              value={dataRetorno}
              onChange={(e) => setDataRetorno(e.target.value)}
              className="mt-1.5 rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="edit-notas">Notas</Label>
            <Textarea
              id="edit-notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="O que foi combinado na conversa..."
              className="mt-1.5 min-h-24 rounded-lg"
            />
          </div>
          <Button
            onClick={salvar}
            disabled={salvando}
            className="h-11 w-full rounded-lg font-semibold"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AdminPanel() {
  const [estado, setEstado] = useState<"carregando" | "deslogado" | "negado" | "admin">(
    "carregando",
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busca, setBusca] = useState("");
  const [carregandoLeads, setCarregandoLeads] = useState(false);
  const [leadEditando, setLeadEditando] = useState<Lead | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const carregarLeads = useCallback(async () => {
    setCarregandoLeads(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setCarregandoLeads(false);
    if (error) {
      toast.error("Não foi possível carregar os leads.");
      return;
    }
    setLeads(data ?? []);
  }, []);

  const verificarSessao = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setEstado("deslogado");
      return;
    }
    const { data: ehAdmin } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (!ehAdmin) {
      setEstado("negado");
      return;
    }
    setEstado("admin");
    carregarLeads();
  }, [carregarLeads]);

  useEffect(() => {
    verificarSessao();
  }, [verificarSessao]);

  const sair = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (estado === "carregando") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Carregando" />
      </div>
    );
  }

  if (estado === "deslogado") {
    return <LoginForm onEntrar={verificarSessao} />;
  }

  if (estado === "negado") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h1 className="mt-4 text-lg font-bold text-foreground">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta não tem permissão para acessar este painel.
          </p>
          <Button onClick={sair} variant="outline" className="mt-6 rounded-lg">
            Sair da conta
          </Button>
        </div>
      </div>
    );
  }

  const termo = busca.trim().toLowerCase();
  const leadsFiltrados = termo
    ? leads.filter(
        (l) =>
          l.nome.toLowerCase().includes(termo) ||
          l.whatsapp.toLowerCase().includes(termo) ||
          l.objetivo.toLowerCase().includes(termo),
      )
    : leads;

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Bolso em Dia</h1>
              <p className="text-xs text-muted-foreground">Painel de acompanhamento</p>
            </div>
          </div>
          <Button onClick={sair} variant="ghost" className="h-9 gap-2 rounded-lg text-sm">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              Leads e clientes ({leads.length})
            </h2>
          </div>
          <div className="relative sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, WhatsApp ou objetivo"
              aria-label="Buscar leads"
              className="h-10 rounded-lg pl-9"
            />
          </div>
        </div>

        {carregandoLeads ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Carregando leads" />
          </div>
        ) : leadsFiltrados.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-foreground">
              {termo ? "Nenhum lead encontrado para essa busca." : "Nenhum lead ainda."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Os formulários enviados pela página inicial aparecem aqui.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {leadsFiltrados.map((lead) => (
              <li
                key={lead.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{lead.nome}</h3>
                      <Badge className={`${corStatus(lead.status)} border-0 text-xs`}>
                        {rotuloStatus(lead.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lead.whatsapp} • {lead.objetivo}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Recebido em{" "}
                        {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      {lead.data_retorno && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                          Retorno em{" "}
                          {new Date(`${lead.data_retorno}T00:00:00`).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    {lead.proxima_acao && (
                      <p className="mt-2 text-sm text-foreground">
                        <span className="font-medium">Próxima ação:</span> {lead.proxima_acao}
                      </p>
                    )}
                    {lead.notas && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Notas:</span> {lead.notas}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-2 rounded-lg"
                    onClick={() => {
                      setLeadEditando(lead);
                      setDialogAberto(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Editar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <EditarLeadDialog
        lead={leadEditando}
        aberto={dialogAberto}
        onFechar={() => setDialogAberto(false)}
        onSalvo={carregarLeads}
      />
    </div>
  );
}
