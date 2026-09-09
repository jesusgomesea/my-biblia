export default function CarregandoCapitulo() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8" aria-busy="true">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="h-9 w-64 animate-pulse rounded-md bg-accent-soft/60" />
        <div className="h-9 w-56 animate-pulse rounded-md bg-accent-soft/60" />
      </div>

      <div className="mt-8 h-8 w-48 animate-pulse rounded-md bg-accent-soft/60" />

      <div className="mt-8 space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="h-4 w-6 shrink-0 animate-pulse rounded bg-accent-soft/40" />
            <span
              className="h-4 flex-1 animate-pulse rounded bg-accent-soft/40"
              style={{ maxWidth: `${70 + ((i * 13) % 30)}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
