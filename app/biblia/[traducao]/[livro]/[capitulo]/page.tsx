import Link from "next/link";
import { notFound } from "next/navigation";
import SeletorPassagem from "@/components/seletor-passagem";
import { bible, livroPorId, type Book } from "@/lib/bible";

function capituloAnterior(livros: Book[], livro: number, capitulo: number) {
  if (capitulo > 1) return { livro, capitulo: capitulo - 1 };
  const anterior = livros.find((l) => l.id === livro - 1);
  return anterior ? { livro: anterior.id, capitulo: anterior.chapters } : null;
}

function capituloSeguinte(livros: Book[], livro: number, capitulo: number) {
  const atual = livros.find((l) => l.id === livro);
  if (atual && capitulo < atual.chapters) return { livro, capitulo: capitulo + 1 };
  const seguinte = livros.find((l) => l.id === livro + 1);
  return seguinte ? { livro: seguinte.id, capitulo: 1 } : null;
}

export default async function Capitulo(
  props: PageProps<"/biblia/[traducao]/[livro]/[capitulo]">,
) {
  const { traducao, livro, capitulo } = await props.params;
  const idLivro = Number(livro);
  const numCapitulo = Number(capitulo);
  if (!Number.isInteger(idLivro) || !Number.isInteger(numCapitulo)) notFound();

  const [linguas, disponiveis, versiculos] = await Promise.all([
    bible.listLanguages(),
    bible.listBooks(traducao),
    bible.getChapter(traducao, idLivro, numCapitulo),
  ]);

  // A fonte devolve nomes que variam por tradução e com caracteres cirílicos
  // trocados em alguns livros, então exibimos os nomes canônicos em português.
  const livros: Book[] = disponiveis.map((livro) => ({
    ...livro,
    name: livroPorId(livro.id)?.nome ?? livro.name,
  }));

  const atual = livros.find((l) => l.id === idLivro);
  if (!atual || versiculos.length === 0) notFound();

  const anterior = capituloAnterior(livros, idLivro, numCapitulo);
  const seguinte = capituloSeguinte(livros, idLivro, numCapitulo);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SeletorPassagem
        linguas={linguas}
        livros={livros}
        traducao={traducao}
        livro={idLivro}
        capitulo={numCapitulo}
      />

      <h1 className="mt-8 font-serif text-2xl font-semibold">
        {atual.name}{" "}
        <span className="text-accent">{numCapitulo}</span>
      </h1>

      <article className="mt-6 space-y-3 font-serif text-lg/8">
        {versiculos.map((versiculo) => (
          <p key={versiculo.number} className="flex gap-3">
            <span className="w-7 shrink-0 pt-1.5 text-right font-sans text-xs text-muted">
              {versiculo.number}
            </span>
            {/* HTML sanitizado em lib/bible/sanitize.ts: só <i> e <mark> sobrevivem. */}
            <span dangerouslySetInnerHTML={{ __html: versiculo.html }} />
          </p>
        ))}
      </article>

      <nav className="mt-10 flex justify-between border-t border-borda pt-4 text-sm">
        {anterior ? (
          <Link
            href={`/biblia/${traducao}/${anterior.livro}/${anterior.capitulo}`}
            className="text-accent hover:underline"
          >
            ← Capítulo anterior
          </Link>
        ) : (
          <span />
        )}
        {seguinte ? (
          <Link
            href={`/biblia/${traducao}/${seguinte.livro}/${seguinte.capitulo}`}
            className="text-accent hover:underline"
          >
            Próximo capítulo →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
