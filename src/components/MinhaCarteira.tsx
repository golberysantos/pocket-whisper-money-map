import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Bot,
  FileText,
  LogOut,
  PiggyBank,
  Send,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCofrinhos } from "@/hooks/useCofrinhos";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type Meta = {
  id: number;
  nome: string;
  valor: number;
};

type WalletState = {
  receitas: number;
  despesas: number;
  metas: Meta[];
};

const STORAGE_KEY = "minha-carteira-v1";

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function parseMessage(text: string): {
  kind: "despesa" | "receita" | "cofrinho" | "desconhecido";
  valor: number | null;
  descricao: string;
  termoCofrinho: string;
} {
  const lower = text.toLowerCase();
  const isCofrinho = /guard|poupei|poupe|depositei|cofrinho/.test(lower);
  const isDespesa = /gast|paguei|comprei|despesa|passei/.test(lower);
  const isReceita = /recebi|ganhei|sal[aá]rio|receita|dep[oó]sito|pix (entrou|recebido)/.test(
    lower,
  );

  const valorMatch = text.match(/r?\$\s*(\d+(?:[.,]\d{1,2})?)|(\d+(?:[.,]\d{1,2})?)/i);
  const valorRaw = valorMatch?.[1] ?? valorMatch?.[2];
  const valor = valorRaw ? parseFloat(valorRaw.replace(",", ".")) : null;

  let descricao = text
    .replace(valorMatch?.[0] ?? "", "")
    .replace(/^(gastei|paguei|comprei|passei|recebi|ganhei)\s*/i, "")
    .replace(/r?\$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  // Termo após "para"/"pro"/"no cofrinho" — ex: "guardei R$ 50 para viagem"
  const termoMatch = text.match(/(?:para|pro|pra|no cofrinho|na cofrinho)\s+(.+)$/i);
  const termoCofrinho = (termoMatch?.[1] ?? descricao).trim();

  if (isCofrinho) return { kind: "cofrinho", valor, descricao, termoCofrinho };
  if (isDespesa || /despesa|gast/.test(lower))
    return { kind: "despesa", valor, descricao, termoCofrinho };
  if (isReceita) return { kind: "receita", valor, descricao, termoCofrinho };
  return { kind: "desconhecido", valor, descricao, termoCofrinho };
}

export function MinhaCarteira() {
  const [receitas, setReceitas] = useState(2000);
  const [despesas, setDespesas] = useState(649);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [entrada, setEntrada] = useState("");
  const [metaFormAberto, setMetaFormAberto] = useState(false);
  const [metaNome, setMetaNome] = useState("");
  const [metaValor, setMetaValor] = useState("");
  const fimChatRef = useRef<HTMLDivElement>(null);
  const { depositarPorTermo } = useCofrinhos();
  const saldo = receitas - despesas;

  // Restaura o estado salvo no navegador (após a hidratação, para casar com o SSR).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as WalletState;
        setReceitas(saved.receitas ?? 2000);
        setDespesas(saved.despesas ?? 649);
        setMetas(saved.metas ?? []);
      }
    } catch {
      // ignora dados corrompidos
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ receitas, despesas, metas } satisfies WalletState),
    );
  }, [receitas, despesas, metas]);

  useEffect(() => {
    fimChatRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [mensagens]);

  const enviarMensagem = (texto: string) => {
    const textoLimpo = texto.trim();
    if (!textoLimpo) return;

    setMensagens((m) => [...m, { role: "user", text: textoLimpo }]);

    const { kind, valor, descricao, termoCofrinho } = parseMessage(textoLimpo);
    let resposta: string;

    if (kind === "cofrinho" && valor !== null) {
      const alvo = depositarPorTermo(termoCofrinho, valor);
      if (alvo) {
        toast(`${brl(valor)} guardado no cofrinho ${alvo.nome}! 🏦`);
        const novoTotal = alvo.atual + valor;
        const pct = Math.min(100, Math.round((novoTotal / alvo.meta) * 100));
        resposta = `Que ótimo! Guardei ${brl(valor)} no cofrinho "${alvo.nome}". Agora ele tem ${brl(novoTotal)} de ${brl(alvo.meta)} (${pct}% guardado).`;
      } else {
        resposta = `Não encontrei um cofrinho com o nome "${termoCofrinho}". Crie um em Cofrinhos Inteligentes e tente de novo!`;
      }
    } else if (kind === "desconhecido" || valor === null) {
      resposta =
        'Não entendi totalmente. Tente algo como "Gastei R$ 30 no mercado" ou "Recebi meu salário de R$ 3000".';
    } else if (kind === "despesa") {
      setDespesas(despesas + valor);
      resposta = `Anotado! Despesa de ${brl(valor)}${
        descricao ? ` (${descricao})` : ""
      } registrada. Seu saldo agora é ${brl(saldo - valor)}.`;
    } else {
      setReceitas(receitas + valor);
      resposta = `Ótimo! Receita de ${brl(valor)}${
        descricao ? ` (${descricao})` : ""
      } registrada. Seu saldo agora é ${brl(saldo + valor)}.`;
    }

    setMensagens((m) => [...m, { role: "assistant", text: resposta }]);
    setEntrada("");
  };

  const criarMeta = () => {
    const valor = parseFloat(metaValor.replace(",", "."));
    if (!metaNome.trim() || !valor || valor <= 0) return;
    setMetas((ms) => [...ms, { id: Date.now(), nome: metaNome.trim(), valor }]);
    setMetaNome("");
    setMetaValor("");
    setMetaFormAberto(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22C55E]/10">
              <Wallet size={16} className="text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Minha Carteira</h1>
              <p className="text-xs text-slate-500">Olá, Golbery Santos</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-lg bg-[#22C55E]/10 text-sm font-medium text-[#16A34A]"
              >
                <Wallet size={16} />
                Painel
              </Button>
            </Link>
            <Link to="/cofrinhos">
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-lg text-sm font-medium text-slate-600"
              >
                <PiggyBank size={16} />
                Cofrinhos
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="h-9 gap-2 rounded-lg text-sm font-medium text-slate-600"
            >
              <FileText size={16} />
              Relatórios
            </Button>
            <Button
              variant="ghost"
              className="h-9 gap-2 rounded-lg text-sm font-medium text-slate-600"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        {/* Cards de resumo */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Receitas
              </p>
              <TrendingUp size={16} className="text-[#22C55E]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{brl(receitas)}</p>
          </Card>

          <Card className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Despesas
              </p>
              <TrendingDown size={16} className="text-[#EF4444]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#EF4444]">{brl(despesas)}</p>
          </Card>

          <Card className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Saldo
              </p>
              <PiggyBank size={16} className="text-[#22C55E]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{brl(saldo)}</p>
          </Card>
        </section>

        {/* Assistente + Metas */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-slate-200 py-4">
              <Bot size={16} className="text-[#22C55E]" />
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Assistente Financeiro
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Converse naturalmente para registrar suas finanças
                </p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10">
                    <Bot size={16} className="text-[#22C55E]" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-muted px-3 py-2 text-sm text-slate-900">
                    Olá! Sou seu assistente financeiro. Me conte sobre seus gastos ou
                    receitas!
                    {mensagens.length === 0 && (
                      <>
                        <p className="mt-2 text-xs text-slate-500">Exemplos:</p>
                        <p className="text-xs italic text-slate-500">
                          "Gastei R$ 30 no mercado"
                        </p>
                        <p className="text-xs italic text-slate-500">
                          "Recebi meu salário de R$ 3000"
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {mensagens.map((msg, i) =>
                  msg.role === "assistant" ? (
                    <div key={i} className="flex gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10">
                        <Bot size={16} className="text-[#22C55E]" />
                      </div>
                      <div className="max-w-[85%] rounded-lg rounded-tl-none bg-muted px-3 py-2 text-sm text-slate-900">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-lg rounded-tr-none bg-[#22C55E] px-3 py-2 text-sm text-white">
                        {msg.text}
                      </div>
                    </div>
                  ),
                )}
                <div ref={fimChatRef} />
              </div>

              <form
                className="flex items-center gap-2 border-t border-slate-200 pt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  enviarMensagem(entrada);
                }}
              >
                <Input
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="h-10 rounded-lg border-slate-200 text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-lg bg-[#22C55E] text-white hover:bg-[#16A34A]"
                  aria-label="Enviar mensagem"
                >
                  <Send size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-200 py-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[#22C55E]" />
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Minhas Metas
                </CardTitle>
              </div>
              <Button
                onClick={() => setMetaFormAberto((a) => !a)}
                className="h-8 gap-1 rounded-lg bg-[#22C55E] text-sm font-medium text-white hover:bg-[#16A34A]"
              >
                <TrendingUp size={16} />
                Nova Meta
              </Button>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-5">
              {metaFormAberto && (
                <form
                  className="mb-4 space-y-3 rounded-lg border border-slate-200 bg-muted/50 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    criarMeta();
                  }}
                >
                  <Input
                    value={metaNome}
                    onChange={(e) => setMetaNome(e.target.value)}
                    placeholder="Nome da meta (ex: Viagem)"
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                  />
                  <Input
                    value={metaValor}
                    onChange={(e) => setMetaValor(e.target.value)}
                    placeholder="Valor alvo (ex: 5000)"
                    inputMode="decimal"
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                  />
                  <Button
                    type="submit"
                    className="h-9 w-full rounded-lg bg-[#22C55E] text-sm font-medium text-white hover:bg-[#16A34A]"
                  >
                    Criar Meta
                  </Button>
                </form>
              )}

              {metas.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Target size={16} className="text-slate-400" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-900">
                    Você ainda não tem metas financeiras.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Crie uma meta para começar!
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {metas.map((meta) => (
                    <li
                      key={meta.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-[#22C55E]" />
                        <span className="text-sm font-medium text-slate-900">
                          {meta.nome}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {brl(meta.valor)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
