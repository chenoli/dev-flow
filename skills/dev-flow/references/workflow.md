# Fluxo de trabalho: fases, checkpoints e commits

## Por que fases

Fases pequenas mantêm cada entrega verificável, revisável e reversível. O usuário acompanha e redireciona a cada fronteira, sem descobrir no final que a direção estava errada. A regra de ouro: **ao fim de cada fase, parar e esperar autorização explícita.**

## 1. Entender

- Ler o bloco dev-flow do `CLAUDE.md`, o plano atual (`refs/architecture/plano-tarefas.md` ou `refs/features/<feature>.md`) e as specs relevantes em `refs/design/`.
- Ler o código que será tocado antes de propor mudanças. Seguir os padrões que já existem ali (nomes, densidade de comentários, idioma).
- Perguntar só o que é genuinamente decisão do usuário: regra de negócio, trade-off de custo ou segurança, identidade legal etc. O resto vira padrão sensato, anunciado no relatório.

## 2. Planejar

- Quebrar em fases de **meio dia a um dia** de trabalho, cada uma entregando algo testável. Ordem:
  1. fundações e modelo de dados;
  2. backend com testes;
  3. frontend com testes;
  4. polimento, a11y e SEO;
  5. o que depende de produção fica por último.
- Gravar o plano em `refs/features/<chave-ou-slug>.md` (modelo `assets/feature-plan.md`) com checkboxes por tarefa e, por fase, um **critério de aceite verificável**. "Funciona" não serve; "o endpoint X devolve 429 na 6ª chamada" serve.
- Apresentar o plano em poucas linhas e **aguardar aprovação** antes de implementar.

## 3. Implementar

- Código e teste juntos: cada arquivo novo ganha seu teste co-localizado na mesma fase.
- Schemas compartilhados (ex.: Zod em `packages/shared`) validam os dois lados. A documentação de API é gerada dos mesmos schemas.
- Migração de banco:
  - Coluna obrigatória em tabela com dados exige migration criada com `--create-only` e backfill manual (nullable → `UPDATE` → `NOT NULL`).
  - Nunca editar migration já aplicada em outro ambiente.
- Mudança de `.env` exige reiniciar o servidor de dev, porque o watch não relê variáveis.

## 4. Verificar (antes da revisão)

Rodar de fato e ler a saída:

```bash
npx turbo run lint -- --fix       # ou o equivalente do projeto; lint corrige, não só relata
npx tsc --noEmit                  # por pacote, se não houver script de typecheck
npx turbo run test                # com cobertura e threshold
npx turbo run build
npm audit --omit=dev              # vulnerabilidades de produção
```

Mais a verificação real, descrita em `testing-and-verification.md`:
- **Tela nova ou alterada:** screenshot em desktop (1440) e mobile (390), temas claro e escuro, sem scroll horizontal, sem violação de CSP no console.
- **Fluxo de backend:** script ao vivo contra a API de dev, com conta descartável criada e apagada no próprio script. Conferir no banco que nada ficou para trás.
- **Mudança de segurança:** teste negativo, que prova que o ataque é bloqueado, e teste de controle, que prova que o teste detecta o ataque quando a proteção está desligada.

## 5. Revisar

Aplicar as 10 camadas de `review-checklist.md`. Corrigir direto o que for de baixo risco. O que envolve trade-off vai para o usuário.

## 6. Fechar a fase

1. Atualizar os checkboxes do plano em `refs/` e anotar extras e limitações conhecidas.
2. Commit no padrão do projeto. O corpo explica **o que e por quê**, com um tópico por mudança relevante e limitações aceitas. Incluir as linhas de coautoria que o ambiente pedir.
3. Relatório para o usuário, curto:
   - o que foi feito (itens principais, com o hash do commit);
   - como foi verificado, com números: testes, cobertura, o que foi testado ao vivo;
   - achados, limitações e decisões tomadas por padrão;
   - o que vem a seguir, terminando com a pergunta de autorização.
4. **PARAR.** Não começar a próxima fase, nem "só adiantar" algo dela.

## Regras de ordenação

- Correções verificáveis localmente vêm antes das que dependem do ambiente de produção: domínio, HTTPS, proxies, segredos reais. Estas últimas ficam numa fase final, junto com o deploy.
- Pedido novo do usuário no meio de um plano: terminar a fase atual (ou pausá-la e registrar isso), tratar o pedido como fase própria e voltar ao plano.
- Pendência descoberta durante uma fase: anotar no plano. Só resolver na mesma fase se for pequena e do mesmo assunto. O usuário pode pedir explicitamente para resolver junto.

## Planos como documento vivo

- `refs/architecture/plano-tarefas.md` é o backlog geral. `refs/features/*.md` guardam o detalhe por feature.
- Análises longas (segurança, conformidade, performance) viram documento em `refs/` com fases de ação e tabela de andamento (fase → status → commit).
- Depois de cada commit, registrar o hash na tabela de andamento.
