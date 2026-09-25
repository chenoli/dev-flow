---
description: Fecha a fase atual (verificação, revisão em 10 camadas, atualização do plano em refs, commit) e para aguardando autorização
argument-hint: "[opcional: nome da fase]"
---

# Checkpoint de fase

Carregue a skill `dev-flow` com a ferramenta Skill. Depois execute o fechamento descrito em "6. Fechar a fase" de `references/workflow.md`:

1. **Verificar:**
   - lint com `--fix`, tipos, testes com cobertura, build, `npm audit --omit=dev`;
   - verificação visual ou ao vivo, se a fase tocou em tela ou em fluxo de backend.
   Se algo falhar, corrija e repita. Não feche uma fase quebrada. Se não der para corrigir, relate e pare.
2. **Revisar** as 10 camadas (`references/review-checklist.md`) e corrigir os achados.
3. **Atualizar o plano** em `refs/` (feature e/ou `architecture/plano-tarefas.md`): checkboxes, limitações e pendências.
4. **Fazer o commit** no padrão do projeto (bloco dev-flow do `CLAUDE.md`). Corpo em tópicos, explicando o quê e o porquê. Registre o hash na tabela de andamento do plano.
5. **Tracker:** se configurado para escrita, proponha o comentário e a transição, e só execute após confirmação.
6. **Relatório curto**, com números. Termine perguntando se pode seguir para a próxima fase (`$ARGUMENTS`, se informado).
7. **PARE.** Não inicie a próxima fase.
