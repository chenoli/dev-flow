# Pegadinhas conhecidas (e como resolver)

## Dependências e Docker
- **"Funciona no host, quebra no Docker" com versão errada de uma lib.**
  - O Dockerfile copiava só o `package.json` do app antes do `npm install`. O npm re-resolveu a árvore, a hospedagem saiu diferente do lockfile e a versão errada ficou na raiz: `z.toJSONSchema is not a function` só no container.
  - Correção: copiar o `package.json` de **todos** os workspaces e usar `npm ci`.
- **`overrides` para forçar uma versão única** quebrou outro consumidor. Exemplo: forçar Zod v4 quebrou a CLI do shadcn, que usa `.deepPartial()` do v3.
  - Antes de fixar, checar todos os consumidores.
  - Com `npm ls <pkg>` mostrando `invalid`, preferir uma reinstalação limpa (`rm -rf node_modules package-lock.json && npm install`).
- Dependência nova de runtime entra no `dependencies` do pacote que a usa (inclusive `zod` no web, se importado lá), mesmo que já venha deduplicada.

## Servidores de dev
- **Mudou o `.env`? Reiniciar o dev server.** O watch não relê variáveis.
- **Windows + `nest start --watch`:** matar só o processo da porta deixa o watcher vivo. Ele morre no próximo restart e deixa zumbis. Matar todo `node.exe` com "nest" na linha de comando:
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'nest' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  ```
  Depois subir um único servidor e confirmar **uma** linha "successfully started" no log.
- App travado no spinner de sessão: normalmente a API caiu, porque o `/auth/refresh` não responde.

## Banco
- Coluna obrigatória com default do Prisma numa tabela com dados: a migration falha ou aplica o default errado.
  - Usar `migrate dev --create-only` e editar o SQL: coluna nullable → `UPDATE` de backfill → `SET NOT NULL`.

## Next.js
- `poweredByHeader: false` pode não remover `X-Powered-By` das páginas renderizadas (Next 16). O risco é mínimo; registrar como limitação conhecida.
- Código que precisa rodar antes do app no cliente (ex.: `z.config({ jitless: true })`) vai em `instrumentation-client.ts`. No provider é tarde demais.
- Rotas públicas precisam ser liberadas no middleware/proxy de sessão (lista explícita), com teste logado e deslogado.

## Tailwind / UI
- Token de font-size novo fora do grupo `font-size` do `cn()` deixa o texto invisível, porque a cor é descartada no merge.
- `field-sizing: content` ignora `rows` em textarea. Usar `min-h-*`.
- Menu (dropdown) que abre um diálogo precisa ser fechado programaticamente (estado controlado), senão fica por cima do diálogo.

## Edição de arquivos (agente)
- Heredoc no bash colapsa barras invertidas (e `\\n` vira quebra de linha real). Para conteúdo com `\`, escrever o script num arquivo e executá-lo, ou usar a ferramenta de edição.
- Alguns arquivos são CRLF. Em substituição de várias linhas, detectar e preservar o fim de linha do próprio arquivo.
- `eslint --fix` pode reordenar imports e remover diretivas `eslint-disable` sem uso. Reler o arquivo antes de editar de novo.
- `/tmp` do Git Bash não é o mesmo que o Python do Windows enxerga. Usar a pasta de rascunho da sessão.
- Um script de edição com vários passos que aborta no meio deixa o primeiro arquivo alterado. Conferir o estado antes de reexecutar.

## Verificação
- Navegar para a mesma URL mudando só o `#hash` não dispara `load`. Mudar a query.
- `Input.insertText` num grupo de caixas de dígito insere tudo na primeira caixa. Digitar caractere a caractere.
- Script ao vivo que falha no meio precisa apagar a conta descartável no `finally`. Se sobrar alguma, apagar pelo e-mail exato no banco.
