# Login único do aluno

**Data:** 2026-10-09

Alunos (`users.type = student`) deixam de ter e-mail e entram com `login` e senha. Responsáveis, professores, admins e suporte continuam com e-mail.

O PostgreSQL local não estava acessível na hora da migration (`127.0.0.1:5432`). O `ALTER` segue as migrations já versionadas de `users`.

## Banco

- `users.email` passa a aceitar nulo.
- Coluna `users.login` (até 32 caracteres), nula para quem não é aluno.
- Índice único `users_login_unique` em `lower(login)`, só onde `login` não é nulo e `deleted_at` é nulo.

## Cadastro do filho

`POST /api/v1/guardian/purchases/{uuid}/student`

`email` saiu. Entram `login`, `password` e `password_confirmation`. A conta nasce `active`, sem e-mail e sem código. O `201` devolve `login` no recurso `student`.

O login tem 3 a 32 caracteres, começa com letra e aceita letras, números, ponto, hífen e sublinhado. É único no sistema inteiro.

## Convite escolar

`POST /api/v1/school/students`

`invite.email` saiu. Com `invite`, a escola envia `invite.login`, `invite.password` e `invite.password_confirmation`. Sem `invite`, a ficha continua sem usuário. Professor não muda.

`StudentResource` expõe `user.login`. `user.email` fica `null`.

## Entrada

`POST /api/v1/mobile/auth/login` (o mesmo corpo vale para client, admin e suporte) aceita `email` ou `login`, nunca os dois.

- `login` autentica só usuário `student`. `tenant_id` não é necessário.
- E-mail de um aluno responde `422` no campo `login`.
- OTP e troca de e-mail recusam usuário `student`.

## Seeders

O login do aluno de demonstração é o local-part do e-mail antigo, com a mesma senha.

| Origem          | Login                                           | Senha                           |
| --------------- | ----------------------------------------------- | ------------------------------- |
| Escola exemplo  | `aluno`, `ana`, `pedro`                         | `123123`                        |
| Família         | `luiza`, `miguel`                               | `123123`                        |
| Alfabetização   | `aluno.teste` e os local-parts (`lucas.alf`, …) | `123123`                        |
| Demo Aurora     | local-part (`theo`, `livia`, …)                 | `AKILI_DEMO_PASSWORD`           |
| Sandbox Mossoró | local-part; `pedro.mossoro` e `miguel.mossoro`  | `AKILI_CLIENT_SANDBOX_PASSWORD` |

`aluno.teste`, `pedro.mossoro` e `miguel.mossoro` existem para não repetir um login que outro seeder já usa no mesmo banco.

## Contas já existentes

Alunos criados antes desta entrega continuam com e-mail no banco e sem `login`. Eles deixam de entrar com e-mail. Esta entrega não gera login nem senha para essas contas e não inclui endpoint de troca de senha.

## Passo manual

```bash
docker compose -f docker/compose/docker-compose.yml exec app php artisan migrate
```
