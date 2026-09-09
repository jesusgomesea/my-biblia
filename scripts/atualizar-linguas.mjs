#!/usr/bin/env node
// Baixa o catálogo de línguas + traduções do Bolls.life e o grava como JSON
// versionado. Rodar de vez em quando: `node scripts/atualizar-linguas.mjs`.
//
// A ideia é evitar um dos três fetches externos que a página de leitura faz.
// O catálogo muda pouco; um refresh manual está de bom tamanho.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const destino = resolve(aqui, '..', 'lib', 'bible', 'linguas.json')

const URL = 'https://bolls.life/static/bolls/app/views/languages.json'

const resposta = await fetch(URL)
if (!resposta.ok) {
  console.error(`Falha ao baixar ${URL}: ${resposta.status}`)
  process.exit(1)
}

const cru = await resposta.json()

// Normaliza para o mesmo formato que `listLanguages` devolve — evita converter
// em runtime a cada request.
const linguas = cru
  .map((entrada) => ({
    name: entrada.language,
    translations: entrada.translations.map((t) => ({
      id: t.short_name,
      name: t.full_name,
      language: entrada.language,
    })),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

await writeFile(destino, JSON.stringify(linguas, null, 2) + '\n', 'utf8')
console.log(
  `Gravei ${linguas.length} línguas em ${destino} (${linguas.reduce(
    (n, l) => n + l.translations.length,
    0,
  )} traduções no total).`,
)
