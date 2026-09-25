# Integrações com APIs de terceiros e conformidade

Lições da integração com o LinkedIn (login OIDC e publicação). Valem para qualquer provedor: Google, GitHub, Meta etc.

## Antes de integrar
- Salvar os **termos de uso da API** do provedor em `refs/third-party/` e lê-los de fato.
- Registrar em `refs/` quais escopos serão pedidos e por quê. Pedir o **mínimo**. Se precisar pedir mais (ex.: o provedor invalida tokens quando o conjunto de escopos muda), documentar a justificativa.
- Credenciais do app (client secret) só no `.env` do backend. Nunca no front, nunca no git. O usuário digita o secret direto no `.env`, **nunca no chat**.

## Implementação
- Fluxo OAuth com state assinado, nonce e validação do `id_token` (ver `security.md`).
- APIs versionadas por calendário (ex.: header `LinkedIn-Version: YYYYMM`) expiram. Um erro 426 ou "NONEXISTENT_VERSION" significa que a versão morreu. Deixar a versão numa constante com comentário e anotar a data de revisão no plano.
- Dados de perfil (nome, foto) só atualizados quando o usuário está usando o app (login ou reconexão), **nunca em rotina automática**, a menos que os termos permitam.
- Foto de perfil: baixar, reduzir (ex.: 96×96 WebP com sharp) e guardar no próprio storage. Não depender de URL externa que expira.
- Pedidos de vínculo temporários (login não concluído) guardam dados pessoais e tokens. Têm `expiresAt` e **limpeza diária**.
- Mostrar o nome da conta conectada, não o identificador técnico (URN/ID).
- Publicação em nome do usuário **só com clique explícito**. Postagem automática ou agendada costuma ser proibida (LinkedIn 3.1).

## Conformidade (auditoria cláusula por cláusula)
Criar `refs/<provedor>-compliance.md` com uma tabela: cláusula → exigência → situação (✅ conforme, 🔧 corrigido, 📋 depende de deploy, ⚠️ decisão justificada). Itens que quase sempre aparecem:

1. **Política de Privacidade e Termos de Uso**
   - Páginas públicas (`/privacy`, `/terms`), nos idiomas do app, com links no cadastro, no login e no menu do usuário.
   - Se a UI diz "você concorda com os Termos", as páginas **têm que existir**.
   - Conteúdo mínimo:
     - quem é o controlador (pessoa física ou empresa, a perguntar ao usuário) e o contato;
     - dados coletados, com uma seção própria para os dados do provedor;
     - finalidades e bases legais (LGPD art. 7º);
     - com quem os dados são compartilhados (inclusive o provedor de IA do usuário);
     - retenção por tipo de dado;
     - cookies;
     - direitos do titular (LGPD art. 18);
     - como excluir;
     - mudanças na política.
   - Os Termos dizem que o app **não é afiliado nem endossado** pelo provedor e que o suporte é do app.
2. **Consentimento antes de autorizar**
   - Aviso ao lado de **todo** botão que leva ao provedor (`aria-describedby`): que dados vêm, quando e para que são usados, como retirar o consentimento e como apagar.
   - O aviso tem link para a seção do provedor na política.
   - Textos de UI precisam ser **exatos**. "Guardamos só a sessão" é falso se também guardamos nome e foto.
3. **Exclusão a pedido do usuário**
   - Desconectar apaga tokens e dados de perfil e revoga o token no provedor.
   - Excluir a conta pela própria UI, com confirmação por código.
   - Um endpoint sem tela não basta.
4. **Retenção mínima.** Nada guardado além do necessário: pedidos expirados apagados.
5. **Marca**
   - Logo e nome do provedor só dentro do app, para identificar a integração, na cor oficial (registrada como token).
   - Uso externo (landing page, anúncio) precisa de aprovação do provedor.
6. **Segurança**
   - Processo escrito de vulnerabilidades e incidentes (`SECURITY.md`).
   - Prazos de aviso ao provedor (ex.: LinkedIn exige aviso em 24 h a security@linkedin.com).
7. **Pendências de operação**, no checklist de deploy:
   - URL da política cadastrada no portal do provedor;
   - redirect URI de produção;
   - nome, descrição e logo do app;
   - perfis de teste conforme as regras do provedor.

Os textos legais são redigidos seguindo a LGPD e os termos do provedor, mas **avisar o usuário que não substituem revisão jurídica**.

## Hooks de terceiros que reescrevem arquivos
Se um hook de outro plugin pedir para rodar um script que altera um arquivo recém-escrito:
1. Rodar primeiro em modo de simulação, com saída para um arquivo de rascunho.
2. Comparar com `diff`.
3. Só aplicar se a mudança for inofensiva.

Caso real: um "limpador" apagaria o campo `description` do frontmatter de uma skill, o que quebraria a skill. A palavra que disparava o alarme ("CLAUDE.md" no frontmatter) foi reescrita e o hook parou de bloquear.
