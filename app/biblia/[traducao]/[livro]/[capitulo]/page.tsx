import Link from "next/link";
import { notFound } from "next/navigation";
import CampoBusca from "@/components/campo-busca";
import ListaVersiculos from "@/components/lista-versiculos";
import PrefetchAdjacentes from "@/components/prefetch-adjacentes";
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

  // Uma tradução ou capítulo que não existe faz a fonte externa responder com
  // erro; sem isto ele subiria como 500 em vez da página de não encontrado.
  const dados = await Promise.all([
    bible.listLanguages(),
    bible.listBooks(traducao),
    bible.getChapter(traducao, idLivro, numCapitulo),
  ]).catch(() => null);
  if (!dados) notFound();
  const [linguas, disponiveis, versiculos] = dados;

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
  const urlAnterior = anterior
    ? `/biblia/${traducao}/${anterior.livro}/${anterior.capitulo}`
    : null;
  const urlSeguinte = seguinte
    ? `/biblia/${traducao}/${seguinte.livro}/${seguinte.capitulo}`
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PrefetchAdjacentes urls={[urlAnterior, urlSeguinte]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SeletorPassagem
          linguas={linguas}
          livros={livros}
          traducao={traducao}
          livro={idLivro}
          capitulo={numCapitulo}
        />
        <CampoBusca traducao={traducao} />
      </div>

      <h1 className="mt-8 font-serif text-2xl font-semibold">
        {atual.name}{" "}
        <span className="text-accent">{numCapitulo}</span>
      </h1>

      <ListaVersiculos
        versiculos={versiculos}
        traducao={traducao}
        livro={idLivro}
        capitulo={numCapitulo}
      />

      <nav className="mt-10 flex justify-between border-t border-borda pt-4 text-sm">
        {urlAnterior ? (
          <Link href={urlAnterior} className="text-accent hover:underline">
            ← Capítulo anterior
          </Link>
        ) : (
          <span />
        )}
        {urlSeguinte ? (
          <Link href={urlSeguinte} className="text-accent hover:underline">
            Próximo capítulo →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
