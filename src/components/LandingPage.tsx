import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { whatsappUrl } from "@/lib/config";

const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Conte pra gente o seu nome.")
    .max(100, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD.")
    .max(20, "Número muito longo.")
    .regex(/^[\d()\s+-]+$/, "Use apenas números, espaços e símbolos de telefone."),
  objetivo: z.string().min(1, "Escolha o seu principal objetivo."),
  consentimento: z
    .boolean()
    .refine((v) => v === true, "Precisamos do seu consentimento para entrar em contato."),
});

type LeadFormData = z.infer<typeof leadSchema>;

const objetivos = [
  "Sair das dívidas",
  "Criar uma reserva de emergência",
  "Guardar dinheiro para um objetivo",
  "Organizar o orçamento do mês",
  "Outro",
];

function LeadForm() {
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { nome: "", whatsapp: "", objetivo: "", consentimento: false },
  });

  const consentimento = watch("consentimento");
  const objetivo = watch("objetivo");

  const onSubmit = async (data: LeadFormData) => {
    const { error } = await supabase.from("leads").insert({
      nome: data.nome,
      whatsapp: data.whatsapp,
      objetivo: data.objetivo,
      consentimento: data.consentimento,
    });

    if (error) {
      toast.error("Não conseguimos enviar agora. Tente de novo em instantes.");
      return;
    }

    setEnviado(true);
    window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
  };

  if (enviado) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-bold text-foreground">Recebemos seu pedido!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Abrimos uma conversa no WhatsApp para você falar com a gente. Se a
          janela não abriu, toque no botão abaixo.
        </p>
        <Button asChild className="mt-6 rounded-lg">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Continuar no WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="nome">Seu nome</Label>
          <Input
            id="nome"
            autoComplete="name"
            placeholder="Como podemos te chamar?"
            className="mt-1.5 h-11 rounded-lg"
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? "erro-nome" : undefined}
            {...register("nome")}
          />
          {errors.nome && (
            <p id="erro-nome" role="alert" className="mt-1.5 text-sm text-destructive">
              {errors.nome.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="whatsapp">Seu WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            className="mt-1.5 h-11 rounded-lg"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "erro-whatsapp" : undefined}
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p id="erro-whatsapp" role="alert" className="mt-1.5 text-sm text-destructive">
              {errors.whatsapp.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="objetivo">Seu principal objetivo</Label>
          <Select
            value={objetivo}
            onValueChange={(v) => setValue("objetivo", v, { shouldValidate: true })}
          >
            <SelectTrigger
              id="objetivo"
              className="mt-1.5 h-11 w-full rounded-lg"
              aria-invalid={!!errors.objetivo}
              aria-describedby={errors.objetivo ? "erro-objetivo" : undefined}
            >
              <SelectValue placeholder="Escolha uma opção" />
            </SelectTrigger>
            <SelectContent>
              {objetivos.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.objetivo && (
            <p id="erro-objetivo" role="alert" className="mt-1.5 text-sm text-destructive">
              {errors.objetivo.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="consentimento"
            checked={consentimento}
            onCheckedChange={(v) =>
              setValue("consentimento", v === true, { shouldValidate: true })
            }
            aria-invalid={!!errors.consentimento}
            aria-describedby={errors.consentimento ? "erro-consentimento" : undefined}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="consentimento" className="text-sm font-normal leading-snug">
              Autorizo o Bolso em Dia a entrar em contato comigo pelo WhatsApp
              para conversar sobre o serviço.
            </Label>
            {errors.consentimento && (
              <p
                id="erro-consentimento"
                role="alert"
                className="mt-1.5 text-sm text-destructive"
              >
                {errors.consentimento.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg text-base font-semibold"
        >
          {isSubmitting ? "Enviando..." : "Montar meu primeiro plano"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Não pedimos senha de banco, saldo ou documentos. Depois do envio,
          abrimos uma conversa no WhatsApp.
        </p>
      </div>
    </form>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <span className="text-base font-bold text-foreground">Bolso em Dia</span>
          </div>
          <Button asChild variant="outline" className="rounded-lg">
            <a href="#formulario">Começar agora</a>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Para quem está começando
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                Organize seu dinheiro com um plano simples e alguém para te acompanhar
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                O Bolso em Dia ajuda você a definir seu primeiro objetivo
                financeiro e a manter o hábito de organização — sem planilhas
                complicadas e sem palavras difíceis.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-lg text-base font-semibold">
                  <a href="#formulario">Montar meu primeiro plano</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-lg text-base">
                  <a href="#como-funciona">Como funciona</a>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="space-y-6">
                {[
                  {
                    icon: Target,
                    titulo: "Um objetivo claro",
                    texto: "Você escolhe o que quer alcançar primeiro.",
                  },
                  {
                    icon: PiggyBank,
                    titulo: "Metas visuais",
                    texto: "Acompanhe o progresso de forma simples, no celular.",
                  },
                  {
                    icon: MessageCircle,
                    titulo: "Acompanhamento humano",
                    texto: "Check-ins periódicos pelo WhatsApp, com uma pessoa de verdade.",
                  },
                ].map((item) => (
                  <div key={item.titulo} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.titulo}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Para quem é */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Feito para quem quer começar
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Já tentou se organizar, mas abandonou aplicativos complicados",
                "Prefere linguagem simples a planilhas e gráficos confusos",
                "Quer alguém para lembrar e incentivar, não só uma ferramenta",
              ].map((texto) => (
                <div
                  key={texto}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-5"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-foreground">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Como funciona</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                titulo: "1. Conte seu objetivo",
                texto:
                  "Preencha o formulário curto abaixo. Leva menos de um minuto.",
              },
              {
                icon: MessageCircle,
                titulo: "2. Converse no WhatsApp",
                texto:
                  "A gente te chama para entender sua situação e montar seu primeiro plano.",
              },
              {
                icon: Target,
                titulo: "3. Acompanhe com leveza",
                texto:
                  "Você segue seu plano no app e recebe check-ins periódicos para manter o ritmo.",
              },
            ].map((passo) => (
              <li
                key={passo.titulo}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <passo.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{passo.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{passo.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Limites do serviço */}
        <section className="border-y border-border bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <ShieldCheck
                className="h-8 w-8 shrink-0 text-secondary-foreground"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Transparência: o que o Bolso em Dia não faz
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  <li>• Não movimentamos seu dinheiro nem conectamos à sua conta bancária.</li>
                  <li>• Não damos recomendação de investimentos.</li>
                  <li>• Não prometemos economia ou resultado financeiro garantido.</li>
                  <li>• Nunca pedimos senha de banco, saldo detalhado ou documentos.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="preco">
              <AccordionTrigger>Quanto custa?</AccordionTrigger>
              <AccordionContent>
                Estamos em fase de testes com os primeiros clientes. O valor e as
                condições são combinados na conversa pelo WhatsApp, sem
                compromisso.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seguranca">
              <AccordionTrigger>Meus dados estão seguros?</AccordionTrigger>
              <AccordionContent>
                Coletamos apenas o necessário para o contato: nome, WhatsApp e
                seu objetivo. Não pedimos senhas, dados bancários ou documentos,
                e você pode pedir a exclusão dos seus dados a qualquer momento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="app">
              <AccordionTrigger>Preciso instalar algum aplicativo?</AccordionTrigger>
              <AccordionContent>
                Não. Tudo funciona pelo navegador do celular e a conversa de
                acompanhamento acontece pelo WhatsApp.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="investimento">
              <AccordionTrigger>Vocês indicam onde investir?</AccordionTrigger>
              <AccordionContent>
                Não. O Bolso em Dia é um serviço de organização financeira e
                criação de hábito. Não fazemos recomendação de investimentos.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Formulário */}
        <section id="formulario" className="border-t border-border bg-card">
          <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
              Monte seu primeiro plano
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              Preencha abaixo e continue a conversa no WhatsApp. Sem compromisso.
            </p>
            <div className="mt-8">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center sm:px-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">Bolso em Dia</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Organização financeira com acompanhamento. Sem promessas milagrosas.
          </p>
        </div>
      </footer>
    </div>
  );
}
