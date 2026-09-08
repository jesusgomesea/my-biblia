"use client";

import { useRouter } from "next/navigation";
import type { Book, Language } from "@/lib/bible";

type Props = {
  linguas: Language[];
  livros: Book[];
  traducao: string;
  livro: number;
  capitulo: number;
};

const estiloSelect =
  "rounded-md border border-borda bg-surface px-2 py-1.5 text-sm text-foreground";

export default function SeletorPassagem({
  linguas,
  livros,
  traducao,
  livro,
  capitulo,
}: Props) {
  const router = useRouter();
  const atual = livros.find((l) => l.id === livro);

  return (
    <div className="flex flex-wrap gap-2">
      <select
        aria-label="Tradução"
        className={`${estiloSelect} max-w-56`}
        value={traducao}
        onChange={(e) => router.push(`/biblia/${e.target.value}/${livro}/1`)}
      >
        {linguas.map((lingua) => (
          <optgroup key={lingua.name} label={lingua.name}>
            {lingua.translations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} — {t.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <select
        aria-label="Livro"
        className={`${estiloSelect} max-w-64`}
        value={livro}
        onChange={(e) => router.push(`/biblia/${traducao}/${e.target.value}/1`)}
      >
        {livros.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Capítulo"
        className={estiloSelect}
        value={capitulo}
        onChange={(e) =>
          router.push(`/biblia/${traducao}/${livro}/${e.target.value}`)
        }
      >
        {Array.from({ length: atual?.chapters ?? 1 }, (_, i) => i + 1).map(
          (n) => (
            <option key={n} value={n}>
              Capítulo {n}
            </option>
          ),
        )}
      </select>
    </div>
  );
}
