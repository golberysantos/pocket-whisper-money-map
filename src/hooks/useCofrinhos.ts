import { useCallback, useEffect, useState } from "react";

export type Cofrinho = {
  id: number;
  nome: string;
  meta: number;
  atual: number;
  cor: string;
  icone: string;
};

const STORAGE_KEY = "smart_pockets_v1";

function carregar(): Cofrinho[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cofrinho[]) : [];
  } catch {
    return [];
  }
}

export function useCofrinhos() {
  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([]);

  // Restaura do navegador após a hidratação (casa com o SSR).
  useEffect(() => {
    setCofrinhos(carregar());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cofrinhos));
  }, [cofrinhos]);

  const criarCofrinho = useCallback(
    (dados: Omit<Cofrinho, "id" | "atual">) => {
      setCofrinhos((lista) => [...lista, { ...dados, id: Date.now(), atual: 0 }]);
    },
    [],
  );

  /** Deposita no cofrinho cujo nome bate parcialmente com o termo. Retorna o cofrinho ou null. */
  const depositarPorTermo = useCallback(
    (termo: string, valor: number): Cofrinho | null => {
      const t = termo.trim().toLowerCase();
      if (!t) return null;
      const alvo = cofrinhos.find(
        (c) => c.nome.toLowerCase().includes(t) || t.includes(c.nome.toLowerCase()),
      );
      if (!alvo) return null;
      setCofrinhos((lista) =>
        lista.map((c) => (c.id === alvo.id ? { ...c, atual: c.atual + valor } : c)),
      );
      return alvo;
    },
    [cofrinhos],
  );

  return { cofrinhos, criarCofrinho, depositarPorTermo };
}
