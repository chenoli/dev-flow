# Segurança: padrões e lições

## Como conduzir uma análise de segurança
1. Mapear a superfície: rotas públicas e autenticadas, uploads, integrações OAuth, jobs, storage, cookies e headers.
2. Classificar os achados por severidade (crítico, alto, médio, baixo), com arquivo e linha.
3. Gravar em `refs/seguranca.md`: tabela de achados, fases de ação e tabela de andamento (fase → status → commit).
4. **Ordem das fases:** tudo que é verificável localmente vem antes. O que depende do ambiente de produção (domínio, HTTPS real, número de proxies, segredos reais) vai para a última fase, junto com o deploy.
5. Cada fase de segurança é validada ao vivo:
   - teste negativo, que mostra o ataque bloqueado;
   - teste de controle, que mostra que sem a proteção o ataque passaria;
   - contas descartáveis, apagadas no fim.

## Autenticação e sessão
- **Credenciais nunca em `localStorage`/`sessionStorage`.**
  - Refresh token: cookie `httpOnly` + `Secure` (em produção) + `SameSite=Lax`. Só o hash fica no banco.
  - Access token: curto (15 min), **só em memória** (store sem `persist`).
  - Ao carregar a página, um silent refresh via `/auth/refresh`.
- **Refresh tokens em família** (`familyId`):
  - Rotação atômica.
  - Janela de tolerância curta (~30 s) para corridas legítimas entre abas.
  - Reuso depois da janela revoga a família inteira e grava auditoria (sinal de cookie roubado).
  - Logout revoga a família.
- **Login sem senha por código de e-mail.** Um "store" de códigos com:
  - um código vivo por conta;
  - hash do código;
  - reserva atômica de tentativas (máx. 5);
  - limite de emissão (5 por hora);
  - expiração de 10 minutos.
- **Não revelar se a conta existe:**
  - Pedido de código de login responde igual para e-mail existente ou não.
  - Cadastro com e-mail existente responde igual a um novo: o dono recebe "você já tem uma conta" com um código que só faz login.
  - O reenvio de código também não recusa conta já verificada.
- Verificação de e-mail obrigatória antes de acessar o app.
- Autenticação só por código de e-mail, nunca por app autenticador (TOTP), salvo pedido explícito.

## Rate limiting e proxy
- `ThrottlerGuard` **global** (`APP_GUARD`) com limite padrão, mais `@Throttle` mais rígido nas rotas sensíveis.
- Não adicionar o guard também por rota: somado ao global, conta cada requisição duas vezes.
- `trust proxy` lido de env (`TRUST_PROXY_HOPS`, inteiro positivo, padrão 0). Nunca `true`, porque aí o cliente forja o IP via `X-Forwarded-For`. Testar com um Express real.

## Headers e CSP (front)
- CSP com **nonce por requisição** gerada no middleware/proxy:
  - `script-src 'self' 'nonce-X' 'strict-dynamic'` (mais `'unsafe-eval'` só em dev);
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`;
  - `connect-src` e `img-src` com as origens exatas da API e do storage.
- `upgrade-insecure-requests` **só quando a API é https**. Com API http, ele reescreve as chamadas e nada funciona.
- Libs que usam `new Function` (ex.: Zod JIT) geram violação de CSP. Configurar o modo jitless **antes** do código do app (no Next: `instrumentation-client.ts`, não no provider).
- `style-src 'unsafe-inline'` é aceitável: atributos `style` do React e do Radix não aceitam nonce, e injeção de estilo é muito menos grave que de script.
- Demais headers: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, COOP `same-origin`, HSTS em produção, `poweredByHeader: false`.
- Validar a CSP no navegador real, em produção e em dev, em todas as telas logadas e nos dois temas. Contar os eventos `securitypolicyviolation` (script em `testing-and-verification.md`).
- Teste negativo da CSP: um handler inline injetado e um `<script>` inserido pelo parser (`document.write`) têm que ser bloqueados. Um `<script>` criado por `createElement` passa por design com `strict-dynamic`, então não serve como teste.

## Uploads e storage
- Upload direto por URL pré-assinada, com o prefixo do usuário na chave (`users/<id>/...`, `posts/<id>/...`).
- Na hora de usar a chave, o servidor confere:
  - o **prefixo de dono**;
  - o **tamanho real** (`HeadObject`), não o declarado.
- Tipo de arquivo validado pelos **bytes (assinatura)**, não pelo mimetype do cliente. O nome do arquivo é definido pelo servidor.
- SVG renderizado no servidor: recusar qualquer `href`/`url()` externo (o renderizador pode ler arquivos locais).
- Uploads abandonados: job diário apaga objetos sem referência depois de 24 h de carência.
- Exclusão de conta apaga o storage paginado (listas vêm em lotes de 1000; não parar no primeiro lote).

## OAuth (ex.: LinkedIn)
- `state` amarrado a um cookie httpOnly **assinado**, com path do callback, TTL de 10 min e uso único.
- `nonce` no pedido e validado no `id_token`.
- `id_token` validado (jose): issuer, audience, algoritmo, expiração, nonce.
- PKCE onde o provedor suportar para apps web.
- Tokens de terceiros guardados criptografados (AES-256-GCM, chave mestra em env).
- Vincular identidade externa a uma conta existente pelo e-mail **exige código enviado a esse e-mail**. Um provedor dizer que o e-mail é o mesmo não prova posse da conta.
- Mensagens de erro para o usuário sem URL interna: a URL fica no log.
- Chaves de API de terceiros em header (ex.: `x-goog-api-key`), nunca na query string, porque URLs vão para logs.

## Container e produção
- `npm ci`, `NODE_ENV=production`, `USER node`, Node LTS.
- Swagger desligado em produção.
- Segredos novos e fortes por ambiente. Nunca commitar `.env`; manter `.env.example` completo.
- `SECURITY.md` com o processo de vulnerabilidades e incidentes (modelo em `assets/security-md.md`).

## Auditoria
- Tabela de audit log: login, falhas, reuso de token, conexões e desconexões de integrações, com IP e user agent. Apagada em cascata com a conta.
