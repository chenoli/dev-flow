# Testes e verificação real

## Regras
- Teste co-localizado (`x.tsx` → `x.test.tsx`; `x.service.ts` → `x.service.spec.ts`) escrito **na mesma fase** do código.
- Meta de cobertura por pacote (padrão 80% em linhas, branches, funções e statements), configurada como threshold para quebrar o pipeline.
- Arquivos declarativos sem lógica (ex.: `*.module.ts` do Nest, `layout.tsx`) podem ser excluídos da cobertura, **com comentário explicando por quê**.

## Pegadinhas de teste (todas reais)

| Sintoma | Causa | Solução |
|---|---|---|
| Teste trava até estourar o timeout ao abrir DropdownMenu, Select, Popover ou Combobox | O posicionamento do floating-ui nunca estabiliza no jsdom | Extrair o conteúdo do menu para um subcomponente de markup puro e testá-lo sozinho. O wrapper Radix não é aberto no teste. Dialog funciona normalmente. |
| Mock de `navigator.clipboard` "some" | O user-event instala seu próprio clipboard | Ler de volta com `navigator.clipboard.readText()` |
| `userEvent.upload` não dispara com um arquivo "inválido" | Respeita o atributo `accept` | Usar `fireEvent.change(input, { target: { files: [f] } })` |
| Teste passa sozinho e falha na suíte | Mocks vazando entre testes (`mockResolvedValueOnce` na fila, implementações persistentes) | Usar `vi.resetAllMocks()` em vez de `clearAllMocks` (este não limpa filas nem implementações) |
| `toHaveBeenCalledWith(input)` falha numa mutation | O TanStack v5 chama o `mutationFn` com um 2º argumento (contexto) | No componente, `mutationFn: (x) => api(x)` |
| DI do Nest injeta `undefined` no teste | Falta metadata de decorators | Usar `unplugin-swc` no Vitest |
| Teste de concorrência "passa" sem a correção | O teste não exercita a corrida | Teste de mutação manual: desfazer a correção e ver falhar. Senão, reescrever o teste. |
| Função async de server component | | `render(await Page())`, com `next-intl/server` mockado |

## Verificação ao vivo (backend)
- Rodar a API de dev de verdade e escrever um script Node descartável (na pasta de rascunho, não no repo) que:
  1. cria uma conta descartável (cadastro → código lido do maildev `GET localhost:1080/email` → verificação);
  2. exercita o fluxo: caminho feliz, ataques e limites (ex.: 429 na N-ésima chamada);
  3. **apaga a conta no `finally`**, mesmo em caso de falha;
  4. imprime `PASS`/`FAIL` por verificação.
- Depois, conferir no banco que nada ficou para trás (`docker exec <postgres> psql ... -c "select count(*) ..."`).
- Chamada que custa dinheiro ao usuário (API de IA paga) só com autorização. Quando possível, testar com credencial falsa, que prova o formato da chamada sem custo.

## Verificação visual (frontend)
Com uma extensão de navegador conectada, usá-la. Sem ela, usar `scripts/cdp-harness.mjs`: Chrome headless dirigido via DevTools Protocol, sem dependências (Node ≥ 22, que tem `WebSocket` global).

```js
import { launch } from "./cdp-harness.mjs";
const { proc, page } = await launch({ width: 390, height: 900 });
await page.goto("http://localhost:3000/login");
await page.shot("login-mobile");               // PNG em ./shots
const box = await page.eval(`document.querySelector("h1").getBoundingClientRect().toJSON()`);
proc.kill();
```

Checklist por tela:
- Desktop (1440) e mobile (390), tema claro e escuro (next-themes: `localStorage.theme`).
- Sem scroll horizontal: `document.documentElement.scrollWidth > innerWidth` tem que dar `false`.
- **Medir em vez de confiar em classes:** `getBoundingClientRect`, `getComputedStyle`. Exemplo: todos os badges com o mesmo `x`.
- CSP: registrar os `securitypolicyviolation` com `Page.addScriptToEvaluateOnNewDocument` antes de navegar. A contagem tem que ser 0.
- Abrir o PNG e **olhar**. Texto invisível e sobreposição não geram erro nenhum.
- Navegar para a mesma URL mudando só o `#hash` não dispara `load`. Mudar a query string.

Para logar sem UI: criar a conta pela API e injetar o cookie de refresh com `Network.setCookie`. No fim, apagar a conta.

## Auditorias de UI
- "Toda tela tem skeleton ou estado de carregamento?" Procurar pelos **ramos renderizados** (`status ===`, `isPending`, `data ?`), não só por `useQuery`. Esse método errado já deixou passar o mesmo bug duas vezes.
- Escrita manual no cache (`setQueryData`/`invalidateQueries`) disputando com o primeiro fetch de um `useQuery` produz UI velha. Após `setQueryData`, forçar `invalidateQueries`; ou desabilitar o fetch concorrente (`enabled`) e ser dono da escrita. Só aparece no navegador.
