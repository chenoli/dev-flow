---
name: dev-flow
description: This skill should be used when working in a project set up with dev-flow (its project rules file has a "dev-flow" block), or when the user asks to "configurar o projeto", "fazer onboarding", "criar uma feature", "implementar o card", "/feature", "revisão em 10 camadas", "fechar a fase", "commit da fase", "set up the project", "implement this Jira card" or "run the 10-layer review". It defines phased development with quality gates: plan, implement with co-located tests, verify for real (lint --fix, types, coverage, build, browser), 10-layer review, one commit per phase, then stop and wait for explicit approval.
version: 1.0.0
---

# Dev Flow — desenvolvimento em fases com portões de qualidade

Método de trabalho destilado de um projeto real (monorepo Next.js + NestJS + Prisma). Transforma pedidos em **fases pequenas e verificáveis**. Cada fase termina revisada, commitada e **parada**, à espera de autorização.

## Regras que valem sempre

1. **Ler as regras do projeto antes de tudo.** O `CLAUDE.md` do projeto tem um bloco `<!-- dev-flow:start -->`, gerado no onboarding. Esse bloco manda sobre estas regras gerais. Sem o bloco, sugerir `/dev-flow:onboarding` antes de começar trabalho grande.
2. **Parar a cada fase.** Nunca iniciar a próxima fase por conta própria, mesmo que a anterior tenha fechado limpa. Um "sim" dado mais cedo sobre o roadmap não autoriza pular os checkpoints seguintes. Se a sessão for interrompida no meio de uma fase, retomar a mesma fase.
3. **Um commit por fase ou feature concluída.** Seguir o padrão de commit do projeto: formato, idioma e linhas de coautoria. Nunca fazer push nem abrir PR sem pedido explícito.
4. **Revisão em 10 camadas antes de declarar pronto.** Verificar de fato, não só relatar: `npm view`, `npm ls`, `npm audit`, `grep`/`find`. O lint roda com `--fix` como parte da revisão. Checklist completo em `references/review-checklist.md`.
5. **Teste nasce junto com o código.** Todo componente, página, hook ou serviço novo ganha teste co-localizado na mesma fase. A meta de cobertura do projeto (padrão 80%) quebra o pipeline.
6. **Verificação real, não suposta.** Build e testes passando não bastam para telas. Abrir no navegador, nos dois temas e em desktop e mobile, e medir. Fluxos de API e backend são testados ao vivo com contas descartáveis, apagadas no fim. Ver `references/testing-and-verification.md`.
7. **Relatar com fidelidade.** Se algo falhou ou foi pulado, dizer. Achado que envolve trade-off (trocar framework, versão major, custo) vai para o usuário decidir, não é resolvido em silêncio.
8. **Dúvida genuína vira pergunta; o resto vira decisão com padrão sensato.** Não perguntar o que dá para descobrir no código.

## Ciclo de uma fase

```
entender → planejar (fases) → [aprovação] → implementar + testes
→ verificar (lint --fix, tipos, testes+cobertura, build, navegador/ao vivo)
→ revisão em 10 camadas → corrigir achados → atualizar plano em refs/
→ commit → relatório curto → PARAR
```

Detalhes de cada etapa, formato do relatório e do plano estão em `references/workflow.md`.

## Pasta `refs/` (apoio local, fora do git)

- `refs/` fica no `.gitignore`. Guarda o design system, as specs de tela, a arquitetura, o backlog (`refs/architecture/plano-tarefas.md`), os planos de feature (`refs/features/`), as análises (segurança, conformidade) e as referências de terceiros.
- Antes de construir uma tela, ler a spec correspondente em `refs/design/`. Não adivinhar copy, cores ou espaçamentos.
- O plano no disco é atualizado ao fim de cada fase, mesmo sem ser versionado. O registro oficial é o `git log`. Se o plano estiver defasado, reconstruir o estado a partir do log.

## Comandos do plugin

| Comando | Uso |
|---|---|
| `/dev-flow:onboarding` | Perguntas iniciais. Cria `refs/`, o `.gitignore` e o bloco de regras no `CLAUDE.md`. |
| `/dev-flow:feature <descrição ou card>` | Da ideia ou card (Jira, Linear, GitHub) ao plano em fases, e execução fase a fase. |
| `/dev-flow:review` | Revisão em 10 camadas das mudanças atuais, corrigindo o que for de baixo risco. |
| `/dev-flow:checkpoint` | Fecha a fase atual: verificação, revisão, plano, commit e parada. |

Sem conflito de nome, os comandos também respondem sem o prefixo (`/feature`, `/review`...).

## Onde está cada assunto

Ler sob demanda, só o que a tarefa pede:

| Arquivo em `references/` | Quando ler |
|---|---|
| `onboarding.md` | Rodar ou refazer o onboarding. Contém o roteiro de perguntas e os arquivos gerados. |
| `workflow.md` | Planejar fases, fechar fase, formato de relatório e de plano. |
| `review-checklist.md` | Toda revisão (as 10 camadas com comandos concretos). |
| `stack-defaults.md` | Escolher ou montar stack, estrutura de pastas, formato do repo. |
| `conventions.md` | Nomes de arquivo, comentários, ordem de imports, tokens de Tailwind, docs de API. |
| `security.md` | Autenticação, sessões, uploads, CSP e headers, OAuth, fases de segurança. |
| `testing-and-verification.md` | Escrever testes, pegadinhas de jsdom, verificação ao vivo e no navegador. |
| `seo-a11y.md` | Qualquer tela nova (checklist permanente). |
| `integrations-and-compliance.md` | Integrar API de terceiros (OAuth, termos, privacidade, exclusão de dados). |
| `task-trackers.md` | Conectar Jira, Linear ou GitHub via MCP e ler ou atualizar cards. |
| `gotchas.md` | Algo "funciona no host e quebra no Docker", teste instável, processo zumbi, edição que corrompe arquivo. |

Recursos adicionais:
- `assets/claude-md-block.md`: modelo do bloco de regras que o onboarding grava no `CLAUDE.md`.
- `assets/plano-tarefas.md` e `assets/feature-plan.md`: modelos de backlog e de plano de feature.
- `assets/security-md.md`: modelo de `SECURITY.md` (processo de vulnerabilidades e incidentes).
- `scripts/cdp-harness.mjs`: harness para dirigir o Chrome headless via DevTools Protocol. Serve para screenshots, medições e checagem de CSP quando não houver extensão de navegador. Não precisa de dependências.

## Princípios que evitaram bugs reais

- **Procurar pelo estado renderizado, não pelo hook.** Auditorias do tipo "toda tela tem skeleton?" falham quando se procura só por `useQuery`. Procurar os ramos condicionais de UI (`status ===`).
- **Escrita manual no cache disputando com o primeiro fetch** produz UI velha em silêncio. Só aparece no navegador.
- **Bug visual não gera erro nenhum.** Um exemplo real: texto invisível porque o merge de classes descartou a cor. Screenshot é obrigatório em mudança de token ou componente base.
- **Validar o conteúdo, não a declaração do cliente.** Vale para tipo de arquivo (bytes), tamanho real (HEAD no storage), dono do recurso (prefixo), e-mail existente (respostas iguais).
- **Mudanças que dependem do ambiente de produção vão para o fim.** Tudo que dá para verificar localmente é feito antes do deploy.
