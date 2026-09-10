# Próximos passos

> Arquivo versionado para retomar o desenvolvimento em qualquer máquina.
> Atualize sempre que fechar um item ou anotar um novo. Fluxo: `git pull`,
> ler este arquivo, tocar o próximo item, atualizar aqui, `git push`.

## Onde parou (última atualização: 2026-09-09)

Toda a base funcional e a onda inicial de melhorias estão no `main`. Últimos
commits, do mais novo para o mais antigo:

- (este commit) — **Migra a autenticação para o Netlify Identity.** Saem
  `next-auth`, `bcryptjs`, `auth.ts`, `lib/dados/contas.ts` e as rotas
  `/api/auth/*`; entra `@netlify/identity`. Ganha recuperação de senha e
  confirmação de email nativas. **Exige ligar o Identity no painel.**
- `36c121d` — Conserta o build quebrado em `/entrar`, a asserção errada
  em `sanitize.test.ts` e o lint em `/devprog`.
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
npm install
```

Em uso: `@netlify/identity`, `@netlify/blobs`, `@google/genai`,
`@playwright/test`, `vitest`.

> O `--legacy-peer-deps` **não é mais necessário**. Ele existia porque o
> `next-auth@5.0.0-beta.29` declarava peer de `next@^14 || ^15` contra o Next
> 16 daqui. Com a migração para o Netlify Identity o `next-auth` saiu do
> projeto e o `npm install` puro voltou a funcionar.

### 2. `.env.local` na raiz (não vai pro git)

```
GEMINI_API_KEY=<a chave do Gemini que já era usada>
```

Só isso. O Netlify Identity **não usa variável de ambiente**: o endpoint vem
do runtime do Netlify. O antigo `AUTH_SECRET` era do next-auth e não existe
mais — pode apagar das duas máquinas e do painel.

### 3. Ligar o Netlify Identity no painel (uma vez por projeto)

Site configuration → Identity → **Enable Identity**. Sem isso o login não
funciona nem local nem em produção: `getUser()` devolve `null` e o cadastro
lança `MissingIdentityError`. O app continua abrindo e funcionando pelo
`localStorage`, só não deixa entrar.

Vale conferir, ainda em Identity:

- **Registration**: `Open` (qualquer um cria conta) ou `Invite only`.
- **Emails**: os modelos de confirmação e de recuperação são editáveis; os
  padrões vêm em inglês.

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

- ~~**Rate limit em `/api/auth`**~~ — resolvido pela migração: o cadastro
  deixou de ser rota nossa, o `netlify.toml` voltou a ter só uma regra
  (`gerar`) e sobrou um slot dos dois do plano gratuito.
- ~~**Recuperação de senha**~~ — nativa do Identity, sem serviço de email
  próprio. Telas em `/recuperar-senha` e `/nova-senha`.
- ~~**Confirmação de email no cadastro**~~ — nativa do Identity, controlada
  pela opção `autoconfirm` no painel.
- **Sobras do esquema de auth antigo nos Blobs** — o store `contas` (email →
  hash bcrypt) ficou órfão e pode ser apagado. No store `usuarios`, os blobs
  gravados antes da migração estão chaveados pelos ids do next-auth, que não
  correspondem a nenhum id do Identity: quem tinha conta antiga volta a ver
  só o `localStorage` e precisa recadastrar. Se ninguém chegou a usar em
  produção, é só limpar os dois stores.
- **Testes E2E de auth** — com o Identity ficou mais fácil que antes (dá para
  criar usuário pela API de admin), mas ainda exige `netlify dev` no CI.
- **Merge de sync** — o servidor vira fonte da verdade no primeiro login,
  sem merge fino. Se editar em dois navegadores off-line, o último a
  sincronizar sobrescreve o outro.
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
