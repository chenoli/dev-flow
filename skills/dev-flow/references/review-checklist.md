# Revisão em 10 camadas

A revisão roda ao fim de toda fase e antes de todo commit. O escopo é o que mudou, mas a lista inteira é percorrida. **Checar de fato, não só relatar.** Cada camada tem comandos concretos.

Primeiro passo, sempre: `npx turbo run lint -- --fix` (ou o lint do projeto com `--fix`). O lint corrige, não só aponta. A fase termina com zero warnings.

## 1. Arquitetura e organização
- Limites entre apps e packages respeitados: app não importa de outro app; package compartilhado não depende de app.
- O código novo está na pasta certa (`_components`, `_hooks`, `_lib`, `_stores`, `_providers`, `_models`, ou módulo Nest próprio).
- Nada duplicado que já exista em `packages/shared` ou `packages/ui` (`grep` antes de criar helper).

## 2. Segurança
- `git diff --cached | grep -iE "secret|password|token|api[_-]?key"`: nenhum segredo no diff. `.env` fica fora do git; `.env.example` atualizado.
- Entrada do cliente validada no servidor (schema), inclusive tipo e tamanho de arquivo **pelo conteúdo**.
- Recurso acessado pertence ao usuário: checar dono e prefixo de storage.
- Nenhuma credencial em `localStorage`/`sessionStorage`. Erros não expõem URL interna, stack ou dados de outro usuário.
- Novas rotas: autenticação, rate limit e resposta que não revela existência de conta.
- Detalhes em `security.md`.

## 3. Dependências
- Pacote novo: `npm view <pkg> maintainers repository time --json`. Conferir procedência, idade, downloads e se o nome não é typosquat.
- `npm ls <pkg>`: sem `invalid` nem versões duplicadas inesperadas. Libs centrais (TypeScript, React, Zod) com a mesma major em todo o monorepo.
- `npm audit --omit=dev` sem vulnerabilidade de produção. Alertas só de dev entram no plano, se relevantes.
- Nunca usar `overrides` para forçar versão única sem checar todos os consumidores (ver `gotchas.md`).

## 4. Banco de dados
- O schema bate com o uso: índices para os filtros novos; `onDelete` correto (cascade para dado do usuário, set null para referência opcional).
- Migration gerada e aplicada. Coluna obrigatória em tabela com dados leva backfill manual.
- Exclusão de conta cobre as tabelas novas (cascade) e os arquivos no storage.
- Dados pessoais novos têm retenção definida e documentada.

## 5. Qualidade de código e TypeScript
- `tsc --noEmit` limpo em cada pacote tocado; `strict` ligado; sem `any`, sem `!` desnecessário, sem `as unknown as` gratuito.
- Funções pequenas e nomes que dispensam comentário. Comentários existentes que só repetem o código são removidos.

## 6. Convenções e consistência
- Nomes de arquivo, ordem de imports, `import type` separado, tokens de Tailwind sem valores arbitrários. Ver `conventions.md`.
- Mensagens e textos em arquivo de i18n, nos dois idiomas. Chaves removidas somem de todos os idiomas.
- Onde o lint não alcança (ex.: backend com oxlint), conferir as convenções à mão.

## 7. Build e tooling
- `npx turbo run build` passa.
- Nenhum script "fantasma", isto é, declarado no `turbo.json`/`package.json` sem implementação: `grep` pelo nome do script nos pacotes.
- Arquivos de config novos são cobertos (ou excluídos de propósito) no lint e na cobertura.

## 8. Docker e infraestrutura
- Dockerfile usa `npm ci` (nunca `npm install`) e copia o `package.json` de **todos** os workspaces antes de instalar.
- Imagem de runtime com `NODE_ENV=production`, usuário sem privilégio (`USER node`) e Node LTS suportado.
- O `.dockerignore` exclui `.env`, `node_modules` e `refs/`.
- Se a fase mexeu em infra, fazer build real da imagem e rodar o container (`docker run … id`, `printenv NODE_ENV`).

## 9. Testes
- Todo arquivo novo com lógica tem teste co-localizado. Cobertura acima da meta **em cada pacote**.
- Testes de comportamento, não de implementação. Casos de erro cobertos: 401, 404, 429, rede.
- Mudança de segurança ou concorrência: um teste que falharia sem a correção. Na dúvida, desfazer a correção e ver o teste falhar (teste de mutação manual).
- Mocks limpos entre testes: `vi.resetAllMocks()` quando há `mockResolvedValueOnce` ou implementações persistentes.
- Ver `testing-and-verification.md`.

## 10. Documentação e DX
- `.env.example`, README e o bloco dev-flow do `CLAUDE.md` refletem a mudança.
- O plano em `refs/` foi atualizado.
- Uma sessão nova conseguiria continuar só com o repositório e `refs/`, sem a memória da conversa?

## Extra: interface (quando houver tela)
- Screenshot nos dois temas e nas duas larguras. Texto visível, contraste ok, nada vazando.
- SEO e acessibilidade da tela conforme `seo-a11y.md`.
- Estados de carregamento: procurar pelos ramos renderizados (`status ===`), não só pelos hooks de query.

## Saída da revisão

Listar os achados como corrigido, pendente (com motivo) ou decisão do usuário. Pendentes vão para o plano.
