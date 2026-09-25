---
description: Revisão em 10 camadas das mudanças atuais, com lint --fix e verificações reais (audit, dependências, testes, build)
argument-hint: "[opcional: foco ou caminho]"
---

# Revisão em 10 camadas

1. Carregue a skill `dev-flow` com a ferramenta Skill e leia `references/review-checklist.md`.
2. Escopo:
   - com argumento (`$ARGUMENTS`): o que ele indicar;
   - sem argumento: `git status` + `git diff` (staged e unstaged) + commits ainda não enviados.
3. Rode o lint com `--fix` primeiro (conforme o bloco dev-flow do `CLAUDE.md`).
4. Percorra as 10 camadas **checando de fato**: `npm view`, `npm ls`, `npm audit --omit=dev`, `grep`/`find`, `tsc --noEmit`, testes com cobertura, build. Se houver telas no escopo, faça a verificação visual.
5. Corrija direto o que for de baixo risco. Achados com trade-off são apresentados ao usuário com uma recomendação.
6. Relate em uma lista: **corrigido**, **pendente** (com motivo) e **decisão do usuário**. Inclua os números de testes, cobertura e audit.
7. Não faça commit aqui, a menos que o usuário peça. Para fechar a fase, use `/dev-flow:checkpoint`.
