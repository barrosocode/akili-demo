# Consentimento do responsável no cadastro do filho

**Data:** 2026-10-09

O menor não aceita termo. Quem aceita é o responsável, no mesmo envio que cria o filho. Sem esse aceite a API não cria usuário, aluno nem vínculo. O aceite fica em `consent_acceptances` (IP, user-agent, versão, checksum e horário) e o progresso daquele filho fica em `guardian_consents`.

O convite escolar não muda.

## Termos da página

`GET /api/v1/guardian/child-registration/consents`

Autenticado, permissão `guardian.children.create`. Envelope padrão, chave `documents`. Não é lista paginada.

```json
{
    "status": 200,
    "message": "Termos do cadastro consultados com sucesso.",
    "errors": {},
    "documents": [
        {
            "uuid": "…",
            "key": "privacy_policy",
            "title": "Política de Privacidade",
            "version": "1.0.0",
            "content": "# Política de Privacidade\n\n…",
            "content_html": "<h1>Política de Privacidade</h1>…",
            "is_required": true
        },
        {
            "uuid": "…",
            "key": "child_progress_consent",
            "title": "Consentimento de progresso do filho",
            "version": "1.0.0",
            "content": "# Consentimento de acompanhamento de progresso\n\n…",
            "content_html": "<h1>Consentimento de acompanhamento de progresso</h1>…",
            "is_required": true
        }
    ],
    "pagination": null,
    "error_code": null
}
```

Entram:

- sempre o documento publicado `child_progress_consent`, mesmo que este responsável já tenha aceitado a versão para outro filho;
- os outros documentos publicados com `is_required` que ele ainda não aceitou nesta versão (hoje, a política de privacidade, se estiver pendente).

O modal usa `content_html`. `content` é o texto de origem.

Aluno não recebe lista de termos. `GET /api/v1/consents/pending` continua vazio para `type = student`.

## Cadastro

`POST /api/v1/guardian/purchases/{uuid}/student`

`consents` é obrigatório e tem de ser exatamente a lista devolvida no GET daquele momento:

```json
"consents": [
  { "document_uuid": "…", "accepted": true }
]
```

`accepted` tem de ser `true`. Falta de termo, termo a mais, termo trocado ou `accepted` falso responde `422` no campo `consents` e não grava nada.

| Campo      | Mensagem                                                    |
| ---------- | ----------------------------------------------------------- |
| `consents` | Aceite os termos para cadastrar o filho.                    |
| `consents` | É preciso aceitar os termos para cadastrar o filho.         |
| `consents` | Aceite todos os termos obrigatórios para cadastrar o filho. |
| `consents` | Os termos de cadastro do filho não estão disponíveis.       |

Dentro da transação, depois do vínculo:

- se o responsável ainda não aceitou aquela versão, grava `consent_acceptances` e audita `consent.granted`;
- para `child_progress_consent`, grava `guardian_consents` daquele aluno e audita `guardians.consent_granted` com o uuid do aluno, a versão e o uuid do aceite.

No segundo filho, o aceite da versão já registrada é reaproveitado. O que nasce de novo é o `guardian_consents` daquele aluno. O detalhe do filho deixa de receber o 403 "Consentimento LGPD necessário para ver progresso."

`GET /api/v1/guardian/purchases`, o GET dos termos e este POST seguem disponíveis mesmo quando o restante do portal responde 403 de termos pendentes. O aceite da política, se ela estiver na lista, acontece neste POST.

## O que o front faz na página de cadastro

1. Buscar `GET /api/v1/guardian/child-registration/consents` ao abrir a página.
2. Abrir um modal por item de `documents`, com o título e o `content_html`.
3. Checkbox desmarcado. Habilitar o checkbox só depois da leitura daquele modal (rolagem até o fim ou confirmação explícita de leitura).
4. Manter o botão de cadastrar desabilitado enquanto existir termo sem checkbox marcado.
5. No POST, enviar `consents` com um item por documento, `document_uuid` igual ao `uuid` da lista e `accepted: true`.
6. Se a API responder 422 em `consents`, mostrar `errors.consents[0]` e não tratar o filho como criado. Buscar a lista de novo: o conjunto exigido pode ter mudado.

A API recusa o cadastro de novo se o POST sair sem os aceites, mesmo que a tela tenha sido contornada.
