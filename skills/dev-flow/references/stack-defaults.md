# Stack padrão e formatos de repositório

Stack validada em produção no projeto de origem. As versões são as do momento em que foi usada. Antes de instalar, confirmar a versão atual (`npm view <pkg> version`) e ler o guia de migração se a major mudou. Next.js em especial muda convenções entre majors: ler `node_modules/next/dist/docs/` quando existir.

## Visão geral (monorepo)

```
repo/
├── apps/
│   ├── web/        # Next.js (App Router), React 19
│   └── api/        # NestJS + BullMQ worker
├── packages/
│   ├── config/     # eslint (estrito, ordem de imports, kebab-case), tsconfig base
│   ├── db/         # Prisma (schema, migrations, client singleton)
│   ├── shared/     # schemas Zod + tipos compartilhados (DTOs dos dois lados)
│   └── ui/         # componentes (shadcn/ui + Radix), tokens Tailwind, cn()
├── docker-compose.yml   # Postgres, Redis, MinIO, maildev (dev)
├── turbo.json
└── refs/           # fora do git
```

Orquestração com **Turborepo** e npm workspaces. Os pacotes internos usam escopo único (`@scope/*`).

## Front-end (`apps/web`)

| Área | Escolha | Observações |
|---|---|---|
| Framework | Next.js (App Router) | Rotas privadas sob `(app)`, auth sob `(auth)`, públicas sob `(legal)` etc. |
| Dados | TanStack Query | Nunca `fetch` em `useEffect`. Mutations com `mutationFn: (x) => api(x)`, porque o TanStack passa um 2º argumento. |
| Formulários | React Hook Form + Zod (`@hookform/resolvers`) | O mesmo schema do `packages/shared` valida a API. |
| Estado global | Zustand | Sem `persist` para qualquer credencial. |
| Estilo | Tailwind CSS v4 + tokens | Tokens em `globals.css` (`:root` + `@theme inline`). Nada de valor arbitrário. |
| Componentes | shadcn/ui (Radix) em `packages/ui` | `cn()` do wrapper local, nunca direto do pacote. |
| Ícones | Lucide | |
| Tema | `next-themes` | Tema e idioma podem ficar no `localStorage`. |
| i18n | `next-intl` | Mensagens em `messages/{pt,en}.json`; `t.rich` para links no meio do texto. |
| Testes | Vitest + Testing Library + jsdom, cobertura v8 | Threshold 80% quebra o pipeline. |
| Lint | ESLint estrito | Ver `conventions.md` e `assets/eslint/`. |

Estrutura de pastas por rota (padrão de underscore, fora do roteamento):

```
app/(app)/history/
├── page.tsx
├── page.test.tsx
├── _components/   _hooks/   _lib/   _models/   _providers/   _stores/
```

## Back-end (`apps/api`)

| Área | Escolha | Observações |
|---|---|---|
| Framework | NestJS | Módulo por domínio; `*.messages.ts` centraliza as mensagens de erro do módulo. |
| Validação | `ZodValidationPipe` com schemas do `packages/shared` | Nada de DTO duplicado com class-validator. |
| Docs | `@nestjs/swagger` em `/docs`, schemas via `z.toJSONSchema()` | Desligado em produção (`EXPOSE_API_DOCS=true` reabre). |
| Filas | BullMQ + Redis | Jobs com linha de status no banco. Jobs recorrentes via `upsertJobScheduler`. |
| Storage | S3 compatível (MinIO em dev, R2/S3 em prod) | URLs pré-assinadas; prefixo por usuário. |
| E-mail | nodemailer (maildev em dev; Resend/SES em prod) | Templates com HTML escapado quando há texto do usuário. |
| Auth | Código por e-mail (passwordless) + JWT curto + refresh em cookie httpOnly | Ver `security.md`. |
| Lint | oxlint | Não roda regras JS custom: convenções de import e comentário conferidas à mão. |
| Testes | Vitest + `unplugin-swc` | Sem SWC, a DI do Nest recebe `undefined`, porque falta metadata de decorators. |

## Banco (`packages/db`)

- Prisma (v7 com `@prisma/adapter-pg`) + Postgres. Um client singleton exportado pelo pacote.
- Nomes em snake_case no banco (`@map`/`@@map`) e camelCase no código.
- Todo dado do usuário com `onDelete: Cascade` a partir de `User`. Referências opcionais com `SetNull`.
- Retenção: dados temporários têm `expiresAt` indexado e um job diário de limpeza.

## Infra de dev

`docker-compose.yml` sobe Postgres, Redis, MinIO e maildev (e-mails de teste em `localhost:1080`). Senhas fracas e portas abertas **só em dev**. Isso vira item da fase de produção.

## Deploy (fase final)

- Imagens Docker multi-stage com `npm ci`, `NODE_ENV=production`, `USER node` e Node LTS.
- Front e API no mesmo site (ex.: `app.` e `api.` do mesmo domínio), para cookies `SameSite=Lax` funcionarem.
- Variáveis de produção novas e fortes, sem reaproveitar as de dev. `TRUST_PROXY_HOPS` com o número real de proxies.

## Formatos de repositório

### Monorepo (recomendado para um produto com front e back)
- Turborepo + workspaces; `packages/shared` é o contrato entre front e back.
- Um lint e um tsconfig base compartilhados; cobertura por pacote.
- Dockerfiles copiam o `package.json` de todos os workspaces antes do `npm ci`.

### Microserviços
- Um repositório (ou pasta com CI próprio) por serviço. Contratos versionados: pacote publicado de schemas, OpenAPI ou protobuf. Nunca importar código de outro serviço.
- Cada serviço tem seu próprio `CLAUDE.md` com o bloco dev-flow e seu próprio plano. O `refs/` pode ficar num repo "guarda-chuva" ou em cada serviço.
- Revisão, camada 1: acoplamento indevido (banco compartilhado, chamadas síncronas em cadeia). Camada 8: healthchecks, timeouts e retries.
- Fases por serviço. Mudança de contrato vira fase própria, com compatibilidade retroativa.

### Microfrontends
- Shell (host) mais remotes (Module Federation, ou composição por rota ou iframe). O design system é um pacote compartilhado e versionado, com tokens únicos.
- Dependências singleton alinhadas: React, roteador, i18n. A revisão confere versões duplicadas em runtime.
- Cada remote com deploy independente; o shell tolera um remote fora do ar.

### App único
- Mesmas regras, sem `packages/`. Os schemas ficam em `src/lib/schemas`.
