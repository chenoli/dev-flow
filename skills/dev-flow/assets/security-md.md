# Segurança: {{NOME_DO_PROJETO}}

Processo escrito de resposta a vulnerabilidades e incidentes.

## Como reportar uma vulnerabilidade
Envie para **{{EMAIL_DE_CONTATO}}**, com o assunto `[segurança]`. Inclua os passos para reproduzir e o impacto. Não teste contra contas de terceiros e não divulgue antes da correção.

## Prazos
| Etapa | Prazo |
|---|---|
| Confirmar o recebimento | até 2 dias úteis |
| Classificar a severidade | até 5 dias úteis |
| Corrigir falha crítica ou alta | o quanto antes |
| Corrigir falha média ou baixa | na próxima fase de segurança |

## Resposta a incidentes
1. **Conter:** revogar ou trocar o que foi exposto (segredos de sessão, chave mestra de criptografia, client secrets de integrações).
2. **Avisar os provedores integrados** nos prazos dos termos deles, por exemplo LinkedIn em até 24 h via security@linkedin.com. Nenhuma declaração pública sem a autorização que os termos exigirem.
3. **Avisar os usuários afetados** e a autoridade de dados (LGPD art. 48; ANPD), quando exigido.
4. **Investigar** pelos logs de auditoria e da aplicação.
5. **Registrar** a causa e a correção em `refs/seguranca.md`.

## Uso indevido por um usuário
A integração é removida e, se o abuso persistir, a conta é encerrada.

## Encerramento do serviço
Dados obtidos de provedores integrados são apagados imediatamente se o serviço for desativado ou o acesso à API for encerrado.
