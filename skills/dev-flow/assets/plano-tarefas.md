# {{NOME_DO_PROJETO}}: plano de tarefas

Backlog sequencial em fases. Fica em `refs/` (fora do git) e é atualizado a cada fase. O registro oficial é o `git log`.

## Andamento

| Fase | Status | Commit |
|---|---|---|
| 0: Fundação | pendente | — |

---

## Fase 0: Fundação
**Objetivo:** repositório pronto para desenvolver com qualidade desde o primeiro commit.

- [ ] T0.1: Estrutura do repo ({{FORMATO_REPO}}) e workspaces
- [ ] T0.2: Lint estrito + formatter + nomes de arquivo forçados
- [ ] T0.3: Testes com threshold de cobertura ({{META_COBERTURA}})
- [ ] T0.4: Infra de dev (docker-compose: banco, cache, storage, e-mail de teste)
- [ ] T0.5: Tokens do design system (`refs/design/`) em CSS/Tailwind
- [ ] T0.6: README + `.env.example`

**Critério de aceite:** `lint`, `test` e `build` passam do zero num clone limpo com `npm ci`; `docker compose up` sobe a infra de dev.

---

## Fase N: Deploy (sempre por último)
- [ ] Variáveis e segredos de produção novos
- [ ] Domínio, HTTPS e número real de proxies (`TRUST_PROXY_HOPS`)
- [ ] Validação ponta a ponta em produção
- [ ] Pendências de conformidade de integrações (URLs de privacidade nos portais etc.)
