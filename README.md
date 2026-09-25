# Dev Flow

Plugin para [Claude Code](https://claude.com/claude-code) que transforma pedidos em **fases pequenas, verificadas e commitadas**, com parada obrigatória entre fases. Destilado de um projeto real: monorepo Next.js + NestJS + Prisma, com login sem senha, integração com o LinkedIn, CSP com nonce, cobertura acima de 80% e verificação no navegador.

## O que vem no pacote

| Peça | O que faz |
|---|---|
| Skill `dev-flow` | Regras de trabalho, fluxo de fases, revisão em 10 camadas, stack padrão, convenções, segurança, testes, SEO/a11y, integrações e conformidade, pegadinhas conhecidas |
| `/dev-flow:onboarding` | Perguntas iniciais: design system, formato do repo, stack, estética de código, padrão de commit e idiomas, tracker de tarefas. Cria `refs/` (fora do git) e o bloco de regras no `CLAUDE.md` |
| `/dev-flow:feature <descrição ou card>` | Da descrição ou do card (Jira, Linear, GitHub) ao plano em fases, e execução fase a fase com verificação, revisão e commit |
| `/dev-flow:review` | Revisão em 10 camadas das mudanças atuais, com `lint --fix` e checagens reais |
| `/dev-flow:checkpoint` | Fecha a fase: verifica, revisa, atualiza o plano, commita e para |
| `assets/eslint/` | Configs de ESLint prontos: estrito, ordem de imports com perfectionist, regra local para separar `import type`, kebab-case |
| `scripts/cdp-harness.mjs` | Chrome headless via DevTools Protocol para screenshots, medições e checagem de CSP, sem dependências |

Sem conflito de nome, os comandos também funcionam sem o prefixo: `/feature`, `/review`...

## Instalação

Dentro do Claude Code:

```
/plugin marketplace add chenoli/dev-flow
/plugin install dev-flow@chenoli
```

Para atualizar depois: `/plugin marketplace update chenoli`.

Para testar localmente antes de publicar, a partir de uma cópia do repositório:

```
/plugin marketplace add C:\Users\olive\Projects\dev-flow
/plugin install dev-flow@chenoli
```

## Uso

1. Num projeto novo ou existente: `/dev-flow:onboarding`.
2. Para cada funcionalidade: `/dev-flow:feature Criar tela de histórico com filtro por status` ou `/dev-flow:feature PROJ-123`.
3. O Claude planeja, pede aprovação, executa **uma** fase, verifica, revisa, commita e **para**. Você responde "sim" para seguir.

## Conectar o Jira (ou outro tracker)

Com o MCP do tracker conectado, `/dev-flow:feature PROJ-123` lê o card direto da fonte. Exemplos de conexão (confirme a URL atual na documentação do provedor):

```bash
claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse    # Jira / Confluence
claude mcp add --transport http linear https://mcp.linear.app/mcp             # Linear
```

Depois rode `/mcp` no Claude Code para autenticar. Para GitHub Issues, a CLI `gh` já basta. Comentários e mudanças de status no card só acontecem com a sua confirmação. Detalhes em `skills/dev-flow/references/task-trackers.md`.

## As regras, em resumo

- **Parar a cada fase** e só continuar com autorização explícita.
- **Um commit por fase**, no padrão escolhido no onboarding.
- **Revisão em 10 camadas** antes de declarar pronto: arquitetura, segurança, dependências, banco, qualidade/TS, convenções, build, Docker, testes, docs. `lint --fix` faz parte dela.
- **Teste junto com o código**, com meta de cobertura que quebra o pipeline.
- **Verificação real:** navegador em dois temas e duas larguras; backend testado ao vivo com contas descartáveis.
- **`refs/` fora do git** para design system, planos e análises.
- **O que depende de produção vai por último.**

## Estrutura

```
.claude-plugin/        marketplace.json + plugin.json
commands/              onboarding, feature, review, checkpoint
skills/dev-flow/
├── SKILL.md           regras e índice (sempre carregado quando a skill ativa)
├── references/        detalhes lidos sob demanda
├── assets/            modelos (bloco do CLAUDE.md, planos, SECURITY.md, eslint)
└── scripts/           cdp-harness.mjs
```

## Licença

MIT
