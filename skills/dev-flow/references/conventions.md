# Convenções de código

O bloco dev-flow do `CLAUDE.md` guarda as escolhas feitas no onboarding. Este arquivo detalha as opções **recomendadas**. Quando o projeto escolher outra, vale a do projeto.

## Nomes de arquivo
- **kebab-case sempre** (`use-theme.ts`, `theme-provider.tsx`, `button.test.tsx`), forçado por `eslint-plugin-check-file` (`assets/eslint/kebab-case.mjs`).
- Só o nome do arquivo é checado. Pastas de rota (`[id]`, `(auth)`, `_components`) seguem o framework.
- Onde o lint não roda (oxlint), conferir à mão ao criar arquivos.

## Comentários
- Só quando **extremamente** importantes: uma restrição escondida, um workaround, um "porquê" não óbvio. Nunca repetir o que o código já diz.
- Sempre em **inglês**, mesmo quando o resto do projeto é em português.
- Comentários desnecessários que já existem são apagados, não mantidos.
- Bons exemplos:
  - `// Looked up regardless of revocation, so a replayed token is recognized.`
  - `// Fixed widths so every row's badge lines up.`

## Ordem de imports
Forçada por `eslint-plugin-perfectionist` (`assets/eslint/import-order.mjs`) e por uma regra local (`assets/eslint/rules/split-inline-type-imports.mjs`):

1. Diretivas e side-effects no topo (`"use client"`, `import "./globals.css"`).
2. Pacotes externos: imports default, depois os nomeados. Dentro de cada grupo, `react`/`react-dom` primeiro e o resto em ordem alfabética.
3. Imports do app: um grupo por contexto (`@scope/shared`, `@scope/ui`, `../_lib`, `../_stores`...), contextos em ordem alfabética entre si, default antes de nomeado.
4. `import type {...}` **sempre em statement separado** (nunca `{ x, type Y }` inline), sempre por último, em ordem alfabética.

Por que a regra local existe: `@typescript-eslint/consistent-type-imports` não separa um import que já está anotado mas misturado, e o perfectionist só reordena, não reestrutura.

Para usar os assets: copiar `assets/eslint/` para `packages/config/eslint/`, trocar `@scope` pelo escopo real e ajustar os `customGroups` às pastas do projeto.

## Rigor do lint
- `react-hooks/rules-of-hooks` e `react-hooks/exhaustive-deps` como **error**.
- `no-explicit-any`: error. `no-unused-vars`: error (ignora `^_`). `no-console`: error. `no-non-null-assertion`: warn, e a fase fecha com zero warnings.
- Toda revisão roda o lint com `--fix`.

## Tailwind e design tokens
- **Nunca** valores arbitrários (`px-[3px]`, `text-[15px]`). Cadastrar um token nomeado em `globals.css` (`:root` + `@theme inline`) e usar a classe gerada.
- Exceção: os multiplicadores da escala de spacing já registrada (`h-12.5` = 50px) não contam como arbitrários.
- **Todo token novo de font-size** (`--text-size-*`) precisa entrar também no grupo `font-size` do `cn()`, via `createCn`/tailwind-merge. Sem isso, o merge trata `text-{token}` como cor e apaga a cor do texto. Aconteceu de verdade: texto invisível em todos os botões, sem erro de build, lint ou teste. Manter um teste de regressão para isso.
- Componentes importam `cn` do wrapper local, nunca direto do pacote.
- Cores de marca de terceiros (ex.: azul do LinkedIn) também viram token.

## Documentação de API
- Swagger gerado dos **mesmos** schemas Zod usados na validação (`z.toJSONSchema()`). Nunca escrever um schema de documentação à parte.

## Mensagens e i18n
- Mensagens de erro do backend centralizadas por módulo (`*.messages.ts`), em inglês.
- Textos de UI só em `messages/*.json`, com os idiomas sempre em paridade. Links no meio do texto via `t.rich`, com tags.
- A UI traduz status HTTP conhecidos (401, 429) em mensagens próprias. Não despejar a mensagem crua da API.

## Idioma dos artefatos (padrão recomendado)
- Conversa, commits, UI e documentos em `refs/`: português.
- Comentários de código, mensagens de erro internas e nomes no código: inglês.

## Commits
- Um por fase. Título curto no padrão escolhido; corpo em tópicos explicando o quê e o porquê; limitações aceitas registradas.
- Nunca `--no-verify`, nunca `--amend` em commit já existente (criar um novo), nunca push sem pedido.
