import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Car,
  FileText,
  Gift,
  GraduationCap,
  House,
  LogOut,
  PiggyBank,
  Plane,
  Plus,
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCofrinhos } from "@/hooks/useCofrinhos";

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ICONES = [
  { id: "plane", Icone: Plane, rotulo: "Viagem" },
  { id: "house", Icone: House, rotulo: "Casa" },
  { id: "piggy", Icone: PiggyBank, rotulo: "Reserva" },
  { id: "car", Icone: Car, rotulo: "Carro" },
  { id: "gift", Icone: Gift, rotulo: "Presente" },
  { id: "graduation", Icone: GraduationCap, rotulo: "Estudos" },
] as const;

const CORES = ["#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6"] as const;

function iconePorId(id: string) {
  return ICONES.find((i) => i.id === id)?.Icone ?? PiggyBank;
}

export function Cofrinhos() {
  const { cofrinhos, criarCofrinho } = useCofrinhos();
  const [dialogAberto, setDialogAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState("");
  const [icone, setIcone] = useState<string>("piggy");
  const [cor, setCor] = useState<string>("#22C55E");

  const criar = () => {
    const metaValor = parseFloat(meta.replace(",", "."));
    if (!nome.trim() || !metaValor || metaValor <= 0) return;
    criarCofrinho({ nome: nome.trim(), meta: metaValor, cor, icone });
    setNome("");
    setMeta("");
    setIcone("piggy");
    setCor("#22C55E");
    setDialogAberto(false);
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
                className="h-9 gap-2 rounded-lg text-sm font-medium text-slate-600"
              >
                <Wallet size={16} />
                Painel
              </Button>
            </Link>
            <Link to="/cofrinhos">
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-lg bg-[#22C55E]/10 text-sm font-medium text-[#16A34A]"
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
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-200 py-4">
            <div className="flex items-center gap-2">
              <PiggyBank size={16} className="text-[#22C55E]" />
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Cofrinhos Inteligentes
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Guarde dinheiro para seus objetivos, um de cada vez
                </p>
              </div>
            </div>
            <Button
              onClick={() => setDialogAberto(true)}
              className="h-8 gap-1 rounded-lg bg-[#22C55E] text-sm font-medium text-white hover:bg-[#16A34A]"
            >
              <Plus size={16} />
              Novo Cofrinho
            </Button>
          </CardHeader>

          <CardContent className="p-5">
            {cofrinhos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <PiggyBank size={16} className="text-slate-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-900">
                  Você ainda não tem cofrinhos.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Crie um cofrinho para começar a guardar!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cofrinhos.map((c) => {
                  const Icone = iconePorId(c.icone);
                  const pct = c.meta > 0 ? Math.min(100, Math.round((c.atual / c.meta) * 100)) : 0;
                  return (
                    <Card
                      key={c.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${c.cor}26` }}
                        >
                          <Icone size={16} style={{ color: c.cor }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{c.nome}</p>
                          <p className="text-xs text-slate-500">
                            {brl(c.atual)} / {brl(c.meta)}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={pct}
                        className="mt-4 h-2 bg-slate-100"
                        indicatorClassName="bg-[#22C55E]"
                      />
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        {pct}% guardado
                      </p>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="rounded-xl border-slate-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Novo Cofrinho
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Defina um objetivo e comece a guardar pelo assistente.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              criar();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-xs font-medium text-slate-900">
                Nome
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Viagem"
                className="h-10 rounded-lg border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meta" className="text-xs font-medium text-slate-900">
                Meta R$
              </Label>
              <Input
                id="meta"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="Ex: 5000"
                inputMode="decimal"
                className="h-10 rounded-lg border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-900">Ícone</Label>
              <div className="flex flex-wrap gap-2">
                {ICONES.map(({ id, Icone, rotulo }) => (
                  <Button
                    key={id}
                    type="button"
                    variant="ghost"
                    title={rotulo}
                    onClick={() => setIcone(id)}
                    className={`h-10 w-10 rounded-lg border p-0 ${
                      icone === id
                        ? "border-[#22C55E] bg-[#22C55E]/10 text-[#16A34A]"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    <Icone size={16} />
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-900">Cor</Label>
              <div className="flex gap-2">
                {CORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Cor ${c}`}
                    onClick={() => setCor(c)}
                    className={`h-8 w-8 rounded-full transition-all ${
                      cor === c ? "ring-2 ring-slate-900 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <Button
              type="submit"
              className="h-9 w-full rounded-lg bg-[#22C55E] text-sm font-medium text-white hover:bg-[#16A34A]"
            >
              Criar Cofrinho
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
