# Onboarding do projeto

O onboarding roda uma vez por projeto (`/dev-flow:onboarding`) e pode ser refeito quando uma decisão mudar. Ele produz as regras que todas as sessões seguintes vão ler.

## 0. Antes de perguntar: descobrir

Levantar o que já existe, para não perguntar o que dá para ver:

- `git status`, `git log --oneline -10` e o remote (`git remote -v`).
- Manifestos: `package.json` (workspaces?), `turbo.json`, `nx.json`, `pnpm-workspace.yaml`, `docker-compose*.yml`, `Dockerfile`s.
- Configs de estilo existentes: `.prettierrc*`, `eslint.config.*`, `.oxlintrc.json`, `.editorconfig`, `biome.json`.
- `CLAUDE.md`/`AGENTS.md` já existentes (preservar o conteúdo, só acrescentar o bloco do dev-flow).
- Últimos commits, para inferir o padrão (Conventional Commits?). O idioma não é inferido: commits são sempre em inglês.

Com isso, cada pergunta abaixo já vem com a opção detectada marcada como "(detectado)" e colocada em primeiro lugar.

## 1. Perguntas

Usar a ferramenta `AskUserQuestion`, com no máximo 4 perguntas por chamada, em rodadas curtas. Colocar a opção recomendada primeiro, com "(Recomendado)". O usuário sempre pode responder em "Other".

### Rodada 1: base do projeto

1. **Design system** (item obrigatório)
   - Opções: "Tenho arquivos (PDF, Figma exportado, HTML de specs, tokens)" / "Link do Figma ou site" / "Ainda não tenho, usar um neutro" / "Usar um design system de uma lib (shadcn/ui, MUI...)".
   - Na sequência, pedir o caminho dos arquivos ou o link.
   - Copiar ou referenciar tudo em `refs/design/`. Arquivos locais: copiar. Links: registrar em `refs/design/README.md`.
   - Extrair os tokens (cores, tipografia, espaçamento, raio, sombras) para `refs/design/README.md`. Esses tokens depois viram CSS variables e tokens nomeados no Tailwind.
2. **Formato do repositório**
   - Opções: "Monorepo (apps + packages compartilhados)" (Recomendado para front+back no mesmo produto) / "Microserviços (um repo ou pasta por serviço)" / "Microfrontends" / "App único".
   - Implicações em `stack-defaults.md`, seção "Formatos de repositório".
3. **Stack**
   - Opções: "Stack padrão do dev-flow (Next.js + NestJS + Prisma + Postgres...)" (Recomendado) / "Manter a stack detectada" / "Outra (descrever)".
   - A stack padrão está em `stack-defaults.md`.
4. **Idiomas (regra fixa, não perguntar)**
   - Código (nomes, variáveis, arquivos), comentários, mensagens de erro internas e **commits: sempre em inglês**.
   - A conversa com o Claude pode ser em português.
   - Português (pt-BR) só aparece como idioma da UI, via i18n, ao lado do inglês (en-US). Perguntar apenas se a UI precisa de outros idiomas além de pt-BR e en-US.
   - Se o projeto já tiver comentários ou commits em outro idioma, propor uma fase para migrar os comentários. O histórico de commits não é reescrito.

### Rodada 2: estética de código

1. **Nomes de arquivo**
   - Opções: "kebab-case forçado por lint" (Recomendado) / "Convenção do framework" / "camelCase/PascalCase".
2. **Formatação**
   - Opções:
     - "Prettier: aspas duplas, ponto e vírgula, 120 colunas" (Recomendado)
     - "Prettier: aspas simples, sem ponto e vírgula"
     - "Biome"
     - "Manter o que existe"
3. **Comentários**
   - Opções:
     - "Só quando explicam um porquê não óbvio, em inglês" (Recomendado)
     - "Documentar funções públicas (JSDoc/TSDoc)"
     - "Livre"
4. **Rigor do lint**
   - Opções:
     - "Estrito: react-hooks como error, sem any, ordem de imports forçada, type imports separados" (Recomendado)
     - "Padrão do framework"
     - "Mínimo"

Detalhes de cada opção recomendada estão em `conventions.md`.

### Rodada 3: commits e fluxo

1. **Padrão de commit**
   - Opções:
     - "Conventional Commits (feat:, fix:, chore:...)" (Recomendado para repos novos)
     - "Título descritivo livre + corpo em tópicos"
     - "Gitmoji"
     - "Manter o detectado"
2. **Granularidade**
   - Opções:
     - "Um commit por fase, com corpo explicando o porquê" (Recomendado)
     - "Um commit por feature"
     - "Commits pequenos por passo"
3. **Branches**
   - Opções: "Branch por feature (feat/<card>-<slug>), merge via PR" / "Direto na main" (projeto solo) / "Trunk-based com PR curto".
4. **Meta de cobertura**
   - Opções: "80% em linhas, branches, funções e statements, quebrando o pipeline" (Recomendado) / "60%" / "Sem meta".

### Rodada 4: gestão de tarefas (item 4)

1. **Onde ficam as tarefas?**
   - Opções: "Jira" / "Linear" / "GitHub Issues" / "Só o backlog local em refs/".
   - Depois da resposta, **informar** como conectar o MCP correspondente (seção "Conectar" de `task-trackers.md`). Não conectar nada sozinho: a conexão exige autenticação do usuário (`/mcp`).
   - Explicar que `/dev-flow:feature PROJ-123` passa a buscar o card direto do tracker.
2. **Atualizar o card automaticamente?**
   - Opções: "Perguntar antes de comentar ou mover o card" (Recomendado) / "Nunca escrever no tracker, só ler".
   - Escrever em serviço externo publica conteúdo, por isso o padrão é pedir confirmação.

## 2. Arquivos gerados

Depois das respostas, mostrar um resumo e **pedir confirmação** antes de gravar. Então:

1. **`refs/`**, com esta estrutura:
   ```
   refs/
   ├── README.md                  # índice da pasta, o que é cada coisa
   ├── design/                    # design system, specs de tela, tokens (README.md)
   ├── architecture/
   │   └── plano-tarefas.md       # backlog em fases (modelo: assets/plano-tarefas.md)
   ├── features/                  # um plano por feature (modelo: assets/feature-plan.md)
   └── third-party/               # termos de API, docs de integrações
   ```
2. **`.gitignore`**: acrescentar `refs/` se ainda não houver. Conferir com `git check-ignore refs/README.md`. Se `refs/` já estiver versionado, avisar e perguntar antes de rodar `git rm -r --cached refs`.
3. **Bloco no `CLAUDE.md`**, com o modelo `assets/claude-md-block.md` preenchido com as respostas, entre `<!-- dev-flow:start -->` e `<!-- dev-flow:end -->`. Se o bloco já existir, substituir só o bloco. Todo o resto do arquivo fica intacto.
4. **Tooling (só com autorização).** Se o projeto for novo ou o usuário quiser, propor como **Fase 0**: scaffold, lint, formatter, testes com threshold e docker-compose de dev. É uma fase como qualquer outra: plano, aprovação, execução, revisão, commit e parada. Nunca instalar dependências dentro do próprio onboarding.

## 3. Encerramento

Resumir o que foi gravado e listar as próximas ações possíveis:
- `/dev-flow:feature <descrição ou card>` para começar;
- conectar o MCP do tracker, se escolhido;
- Fase 0 de tooling, se aplicável.

Parar e aguardar.
