# Próximos passos

> Arquivo versionado para retomar o desenvolvimento em qualquer máquina.
> Atualize sempre que fechar um item ou anotar um novo. Fluxo: `git pull`,
> ler este arquivo, tocar o próximo item, atualizar aqui, `git push`.

## Onde parou (última atualização: 2026-09-09)

Toda a base funcional e a onda inicial de melhorias estão no `main`. Últimos
commits, do mais novo para o mais antigo:

- (este commit) — Conserta o build quebrado em `/entrar`, a asserção errada
  em `sanitize.test.ts` e o lint em `/devprog`. Ver abaixo.
- `132a468` — Auth por email + senha (Auth.js v5 + Credentials + bcrypt).
- `3250599` — Scaffolding de auth (originalmente Google, depois substituído).
- `db8f100` — Seletor de livros em `/biblia` no lugar do redirect.
- `8c91c92` — Aceleração da leitura da Bíblia (catálogo estático, prefetch, skeleton).
- `d65e712` — `<br>` na sanitização.
- `fd4a71f` — Vitest + Playwright versionados.
- `feb6788` — `/planos` ocupa toda a largura no desktop com preview.
- `6a2f920` — Leading page + layout `/planos` em duas colunas.
- `950c2e9` — PWA instalável.

## Página de bastidores

Existe uma rota **não linkada no menu** para inspeção manual:

```
/devprog
```

Ela mostra o estado da sessão, o conteúdo do `localStorage`, permite
semear/limpar dados, forçar sincronização e pingar `/api/dados`,
`/api/auth/session` e o manifest. Sem gate — acesso por URL direta.

## Ações manuais pendentes ANTES de rodar

Estas coisas não estão no git e precisam existir na máquina para o app subir:

### 1. Instalar dependências

```bash
npm install --legacy-peer-deps
```

Foram adicionadas nas últimas leva: `next-auth@5.0.0-beta.29`,
`@netlify/blobs`, `bcryptjs`, `@playwright/test`, `vitest`.

**A flag não é opcional.** O `next-auth@5.0.0-beta.29` ainda declara peer de
`next@^14 || ^15` e aqui o Next é 16, então o `npm install` puro aborta com
`ERESOLVE`. Enquanto o beta não atualizar o peer, é `--legacy-peer-deps` em
toda máquina. O `package-lock.json` já está commitado resolvido assim.

### 2. `.env.local` na raiz (não vai pro git)

```
GEMINI_API_KEY=<a chave do Gemini que já era usada>
AUTH_SECRET=<32 bytes base64; gera com o comando abaixo>
```

Gerando o `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Use o MESMO `AUTH_SECRET` nas duas máquinas.** Trocar invalida os cookies
de sessão emitidos pela outra.

### 3. `AUTH_SECRET` no painel do Netlify

Site settings → Environment variables → `AUTH_SECRET` com o mesmo valor.
Depois disparar um redeploy.

### 4. Netlify CLI para dev local com Blobs

`next dev` sozinho **não injeta o store do Netlify Blobs**, então cadastro/
login/sync explodem. Para testar auth localmente:

```bash
npm install -g netlify-cli
netlify link      # só na primeira vez em cada máquina
netlify dev
```

## Trabalho pendente na lista original de melhorias

Ordem sugerida (a que fizer mais sentido no dia; nenhuma depende da outra):

### #3 — Robustez do `localStorage`
- Envolver `getItem`/`setItem` em `try/catch` (quota exceeded, modo privado).
  Já cobri em `lib/planos/armazenamento.ts` e `lib/marcacoes.ts` recentemente;
  falta padronizar e extrair um `lib/storage/store.ts` genérico.
- **Versionar o formato**: `{ version: 1, planos: [...] }`. Hoje o cast direto
  do JSON explode se o schema mudar.

### #6 — Acessibilidade em `/planos/[id]`
- Botão que abre o dia tem `aria-expanded` mas falta `aria-controls`.
- Painel expandido precisa de `role="region"` + `aria-labelledby`.
- Verificar contraste `text-accent` sobre `bg-accent-soft` (WCAG AA).

### #7 — SEO / compartilhamento
- `generateMetadata` na página de capítulo — hoje "João 3" e "Gênesis 1" saem
  com o mesmo título genérico no Google.
- `app/robots.ts` e `app/sitemap.ts` (Next 16 tem API nativa).
- Open Graph para compartilhar links.

### #8 — Progresso na lista de planos
- Já entrou parcialmente na barra lateral do desktop. Verificar se o mobile
  está mostrando bem também.

### #9 — Prettier + `.editorconfig`
- Aspas simples vs duplas inconsistentes no repo. Prettier resolve.

### #10 — `lib/bible/index.ts` como fachada
- Re-exportar tipos com `export type *` para consumo mais limpo.

### #12 — Observabilidade da IA
- Em `lib/planos/gerar.ts` linha ~127, o erro é engolido quando o modelo cai.
  Adicionar `console.warn` com o modelo que falhou.

### #13 — Ampliar testes de sanitização
- Adicionar mais vetores maliciosos (`javascript:` URIs, encoded entities).
  Base já boa em `tests/unit/sanitize.test.ts`.

## Débitos técnicos anotados no caminho

- **Rate limit em `/api/auth`** (login) — o `netlify.toml` free só permite
  duas regras; ambas ocupadas (`gerar` e `cadastro`). Se virar problema,
  migrar para um plano pago do Netlify ou implementar limiter em código.
- **Recuperação de senha** — hoje esqueceu, perdeu. Precisa serviço de
  email (Resend/SendGrid) para link de reset.
- **Confirmação de email no cadastro** — hoje não pede. Pode virar problema
  de bots com email inválido.
- **Merge de sync** — o servidor vira fonte da verdade no primeiro login,
  sem merge fino. Se editar em dois navegadores off-line, o último a
  sincronizar sobrescreve o outro.
- **Testes E2E de auth** — precisa mockar Credentials e/ou rodar Blobs
  local. Fica para uma tarde inteira.
- **Curadoria do catálogo de traduções** — Bolls.life serve tanto domínio
  público quanto material protegido (`NVIPT`, `NVT`, `NAA`, `MENS`). Servir
  o catálogo todo tem risco de licenciamento. Ver CLAUDE.md.

## Como usar este arquivo

Quando fechar um item:

1. Some ele da seção "Trabalho pendente".
2. Adicione um bullet em "Onde parou" com o commit e uma linha.
3. Atualize `CLAUDE.md` se a decisão for arquitetural.
4. `git add PROXIMOS-PASSOS.md CLAUDE.md && git commit && git push`.

Quando quiser abrir novo débito:

- Anote em "Débitos técnicos" com contexto suficiente para você mesmo
  entender daqui a duas semanas.
