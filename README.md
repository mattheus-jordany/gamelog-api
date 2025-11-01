# Entrega Semana 3: GameLog API

Este documento registra o progresso do projeto GameLog API até a data de entrega referente à Semana 3 (Login e recuperação de senha).

Esta branch foi criada a partir da `develop` e inclui todo o trabalho das entregas anteriores (Semanas 1-2).

## Funcionalidades Concluídas (Até esta data)

* **Ambiente:** Projeto 100% conteinerizado com Docker, usando Node.js/TypeScript e um fluxo de build (`tsc` + `nodemon`).
* **Banco de Dados:** Modelagem no Prisma completa, com migrações aplicadas.
* **Autenticação:**
    * Endpoint `POST /users` (cadastro) funcional.
    * Endpoint `POST /auth/sessions` (login) funcional.
* **Autorização:**
    * Middlewares `ensureAuthenticated` e `ensureAdmin` funcionais e testados.
* **CRUD (Parcial):**
    * `POST /games` (para admins) e `GET /games` (listagem pública) implementados.
* **Recuperação de Senha (Nova Funcionalidade):**
    * O schema do banco foi atualizado para suportar tokens de reset.
    * As rotas de autenticação foram refatoradas para `/auth`.
    * Endpoint **`POST /auth/forgot-password`** implementado:
        * Valida o e-mail.
        * Gera um token de reset seguro (`crypto`) com expiração de 1 hora.
        * Salva o token e a expiração no banco.
        * *Simula* o envio de e-mail (imprimindo o token no console).
    * Endpoint **`POST /auth/reset-password`** implementado:
        * Valida o token, a confirmação de senha e a expiração do token.
        * Atualiza a senha do usuário com `bcrypt`.
        * Limpa o token do banco para evitar reuso.

---
*Este README é específico para a branch `entrega/semana-3`.*