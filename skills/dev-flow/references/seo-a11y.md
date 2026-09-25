# SEO e acessibilidade: checklist permanente por tela

Estes itens fazem parte do "pronto" de **cada** tela, junto com testes e revisão. Não é uma passada única no fim do projeto.

## SEO
- Metadata API do Next em toda rota (`metadata` ou `generateMetadata`): `title`, `description`, OpenGraph e Twitter card. Em rota multi-idioma, a metadata também muda de idioma.
- `metadataBase` definido uma vez no layout raiz.
- `viewport.themeColor` separado por `prefers-color-scheme`.
- `robots.ts`/`sitemap.ts` **só para rotas realmente públicas**. App autenticado não entra; páginas legais e marketing entram.
- JSON-LD só onde fizer sentido (página pública de produto).
- `<html lang>` correto por idioma.

## Acessibilidade
- **Skip-link** como primeiro elemento focável (`href="#conteudo"`, alvo `<main id tabIndex={-1}>`).
- Formulários:
  - `<label htmlFor>` (ou label `sr-only`) em cada campo;
  - `aria-invalid` no erro e `aria-describedby` apontando para a mensagem;
  - mensagem de erro com `role="alert"`.
- Botão só com ícone precisa de `aria-label`. Ícone decorativo leva `aria-hidden="true"`.
- Foco visível: usar o anel de foco do design system, nunca `outline: none` sem substituto.
- `prefers-reduced-motion` respeitado em animações não triviais (shimmer, spinner, transições).
- Modais e menus: trap de foco, `Escape` fecha e o foco volta ao gatilho. Se um menu abre um diálogo, **fechar o menu** antes; senão ele fica por cima.
- Contraste conferido com os tokens reais, principalmente texto "muted" em fundo claro e no tema escuro.
- Seções longas com `aria-labelledby`; `nav` com `aria-label`; item atual com `aria-current="page"`.
- Aviso ou texto que descreve um botão ligado a ele por `aria-describedby`.
- Links que abrem nova aba: deixar isso claro no contexto.
