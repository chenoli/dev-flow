---
description: Configura o projeto para o dev-flow (design system, formato do repo, estética de código, padrão de commit, tracker de tarefas)
argument-hint: "[opcional: caminho do design system]"
---

# Onboarding dev-flow

1. Carregue a skill `dev-flow` com a ferramenta Skill. Depois leia `references/onboarding.md`, a partir do diretório base da skill, e siga o roteiro exatamente.
2. Argumento opcional recebido: `$ARGUMENTS`. Se for um caminho ou link, use como resposta da pergunta de design system e não repita a pergunta.
3. Antes de perguntar, faça o levantamento da seção "0. Antes de perguntar". Marque as opções detectadas como "(detectado)".
4. Faça as perguntas em rodadas com `AskUserQuestion` (no máximo 4 por chamada), com a opção recomendada em primeiro lugar.
5. Na rodada de tarefas, **informe** como conectar o MCP do tracker escolhido (ver `references/task-trackers.md`). Não execute a conexão: ela exige autenticação do próprio usuário via `/mcp`.
6. Mostre o resumo das escolhas e peça confirmação antes de gravar:
   - `refs/` com a subestrutura;
   - `refs/README.md`;
   - `refs/architecture/plano-tarefas.md`, a partir de `assets/plano-tarefas.md`;
   - entrada `refs/` no `.gitignore`, conferida com `git check-ignore`;
   - bloco `<!-- dev-flow:start -->…<!-- dev-flow:end -->` no `CLAUDE.md`, a partir de `assets/claude-md-block.md`, preservando o restante do arquivo;
   - design system copiado ou referenciado em `refs/design/`, com os tokens extraídos para `refs/design/README.md`.
7. Não instale dependências nem faça scaffold aqui. Se fizer sentido, proponha isso como **Fase 0**.
8. Encerre com o resumo do que foi gravado e as próximas ações possíveis. Depois **pare**.
