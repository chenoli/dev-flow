<!-- dev-flow:start -->
<!-- Gerado por /dev-flow:onboarding em {{DATA}}. Refaça o onboarding para mudar; edições manuais aqui são preservadas até lá. -->
# {{NOME_DO_PROJETO}}: regras de trabalho (dev-flow)

Regras permanentes. Não são sugestões: siga exatamente.

## 1. Parar a cada fase
Nunca inicie a próxima fase por conta própria, mesmo que a anterior tenha fechado limpa. Ao terminar uma fase:
implementar → verificar → revisão em 10 camadas → corrigir → atualizar `refs/` → commit → **parar e esperar autorização explícita**.
Um "sim" sobre o roadmap geral não é cheque em branco. Se a sessão for interrompida no meio de uma fase, retome a mesma fase.

## 2. Commits
- Padrão: {{PADRAO_COMMIT}}
- Granularidade: {{GRANULARIDADE}}
- Idioma das mensagens: inglês (sempre)
- Branches: {{ESTRATEGIA_BRANCH}}
- Nunca push, PR, `--amend` ou `--no-verify` sem pedido explícito.

## 3. Revisão em 10 camadas + lint --fix
Antes de declarar qualquer fase pronta, revisar e checar de fato (`npm view`, `npm ls`, `npm audit`, `grep`/`find`):
arquitetura · segurança · dependências · banco · qualidade/TypeScript · convenções · build/tooling · Docker/infra · testes · documentação/DX.
Rodar `{{COMANDO_LINT_FIX}}` como parte da revisão. A fase fecha com zero warnings.

## 4. Projeto
- Formato do repo: {{FORMATO_REPO}}
- Stack: {{STACK}}
- Design system: {{DESIGN_SYSTEM}}. Specs e tokens em `refs/design/`. Ler a spec antes de construir cada tela.
- Idiomas: código, variáveis, comentários e commits em **inglês**; a conversa pode ser em português; pt-BR só na UI, via i18n, junto com en-US ({{I18N}}).

## 5. Convenções de código
- Nomes de arquivo: {{NOMES_ARQUIVO}}
- Formatação: {{FORMATACAO}}
- Comentários: {{COMENTARIOS}}
- Lint: {{RIGOR_LINT}}
- Ordem de imports: {{ORDEM_IMPORTS}}
- Tokens de design: nunca valores arbitrários. Registrar um token e usar a classe gerada.

## 6. Testes e verificação
- Teste co-localizado para todo código novo, na mesma fase. Cobertura mínima: {{META_COBERTURA}} (quebra o pipeline).
- Telas: verificar no navegador em desktop e mobile, temas claro e escuro, sem scroll horizontal, sem violação de CSP.
- Fluxos de backend: teste ao vivo com conta descartável, apagada no fim.

## 7. Segurança
- Credenciais nunca em `localStorage`/`sessionStorage`. Refresh token em cookie httpOnly; access token só em memória.
- Entradas validadas no servidor pelo conteúdo real (bytes, tamanho, dono), não pelo que o cliente declara.
- Mudanças que dependem do ambiente de produção ficam para a fase de deploy.

## 8. Gestão de tarefas
- Tracker: {{TRACKER}} ({{STATUS_MCP}})
- Escrita no tracker: {{POLITICA_ESCRITA_TRACKER}}
- `/dev-flow:feature <descrição ou card>` inicia uma feature; o plano fica em `refs/features/`.

## 9. Referências
- `refs/` (fora do git): design, arquitetura, `architecture/plano-tarefas.md` (backlog), `features/`, `third-party/`.
- Atualizar os checkboxes do plano a cada fase, mesmo sem versionar. O histórico oficial é o `git log`.
<!-- dev-flow:end -->
