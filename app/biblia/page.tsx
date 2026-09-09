import Link from "next/link";
import { LIVROS, TRADUCAO_PADRAO } from "@/lib/bible";

// Convenção do canon protestante: 1-39 é o Antigo; 40-66 é o Novo.
const ULTIMO_DO_ANTIGO = 39;

export default function Biblia() {
  const antigo = LIVROS.filter((l) => l.id <= ULTIMO_DO_ANTIGO);
  const novo = LIVROS.filter((l) => l.id > ULTIMO_DO_ANTIGO);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-wider text-accent">Bíblia</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold lg:text-4xl">
          Escolha um livro
        </h1>
        <p className="mt-3 text-muted">
          Abrindo em {TRADUCAO_PADRAO}. Você pode trocar a tradução dentro do
          livro.
        </p>
      </header>

      <SecaoTestamento titulo="Antigo Testamento" livros={antigo} />
      <SecaoTestamento
        titulo="Novo Testamento"
        livros={novo}
        className="mt-14"
      />
    </div>
  );
}

function SecaoTestamento({
  titulo,
  livros,
  className,
}: {
  titulo: string;
  livros: typeof LIVROS;
  className?: string;
}) {
  return (
    <section className={`mt-12 ${className ?? ""}`}>
      <h2 className="font-serif text-xl font-semibold">{titulo}</h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {livros.map((livro) => (
          <li key={livro.id}>
            <Link
              href={`/biblia/${TRADUCAO_PADRAO}/${livro.id}/1`}
              className="group flex h-full flex-col justify-between rounded-lg border border-borda bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="font-serif text-base font-medium">
                {livro.nome}
              </span>
              <span className="mt-3 text-xs text-muted">
                {livro.capitulos} {livro.capitulos === 1 ? "capítulo" : "capítulos"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
