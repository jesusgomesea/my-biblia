import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="font-serif text-4xl/tight font-semibold">
        Leia a Bíblia no seu ritmo — e estude com um plano feito para você.
      </h1>
      <p className="mt-5 max-w-xl text-muted">
        Dezenas de traduções, em vários idiomas. Diga sobre o que quer refletir,
        quantos dias tem e quantos minutos cabem no seu dia: o plano de estudo
        sai pronto.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/planos/novo"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background"
        >
          Montar um plano de estudo
        </Link>
        <Link
          href="/biblia"
          className="rounded-md border border-borda px-4 py-2.5 text-sm font-medium"
        >
          Abrir a Bíblia
        </Link>
      </div>
    </div>
  );
}
