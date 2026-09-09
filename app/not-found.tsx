import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="font-serif text-3xl font-semibold">Não encontramos isso</h1>
      <p className="mt-3 text-muted">
        O trecho pode não existir nesta tradução — nem toda tradução traz os 66
        livros — ou o endereço pode estar incompleto.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/biblia"
          className="rounded-md bg-accent px-4 py-2 font-medium text-background"
        >
          Abrir a Bíblia
        </Link>
        <Link href="/busca" className="rounded-md border border-borda px-4 py-2">
          Buscar um trecho
        </Link>
      </div>
    </div>
  );
}
