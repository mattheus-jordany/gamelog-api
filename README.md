# Entrega Semanas 4-5: CRUD Completo & "Ir Além"

Este documento registra o progresso do projeto GameLog API até a data de entrega referente às Semanas 4 e 5 (CRUD Completo).

Esta branch foi criada a partir da `develop` e inclui todo o trabalho das entregas anteriores (Semanas 1-3).

## 1. CRUD Completo (Requisito Semanas 4-5)

O CRUD completo para todas as 3 entidades (`Game`, `UserGameLog`, `User`) foi implementado.

* **Entidade `Game` (Catálogo de Jogos - Admin):**
    * `POST /games`: (Admin) Adiciona um novo jogo ao catálogo.
    * `GET /games`: (Público) Lista todos os jogos com paginação.
    * `GET /games/:id`: (Público) Detalha um jogo específico.
    * `PUT /games/:id`: (Admin) Atualiza um jogo.
    * `DELETE /games/:id`: (Admin) Deleta um jogo.

* **Entidade `UserGameLog` (Log Pessoal do Usuário):**
    * `POST /logs`: (Logado) Adiciona um jogo ao seu log pessoal.
    * `GET /logs/my`: (Logado) Lista todos os jogos do seu log pessoal.
    * `PUT /logs/:id`: (Logado) Atualiza um registro de log (status, nota, etc.).
    * `DELETE /logs/:id`: (Logado) Deleta um registro do seu log.

* **Entidade `User` (Usuário):**
    * `POST /users`: (Público) Cadastro (CRUD - Create).
    * `GET /users`: (Admin) Listar todos os usuários (CRUD - Read).
    * `GET /auth/profile`: (Logado) Ver o próprio perfil (CRUD - Read).
    * `PUT /auth/profile`: (Logado) Atualizar o próprio perfil (CRUD - Update).
    * `DELETE /auth/profile`: (Logado) Deletar a própria conta (CRUD - Delete).

## 2. Funcionalidades "Ir Além" (Requisitos Oficiais do Desafio)

* **Upload de Imagens (Cloudinary):** **[Iniciado]**
    * Dependências (`multer`, `cloudinary`) instaladas.
    * Chaves de API configuradas no ambiente (`.env`, `docker-compose.yml`).
    * Arquivos de configuração (`cloudinary.ts`, `multer.ts`) criados.
    * Controller (`UploadAvatarController.ts`) e rota (`PATCH /auth/profile/avatar`) implementados.
* **Envio de E-mails:** **[Pendente]** (Ainda em simulação no console).
* **Testes Automatizados (Jest):** **[Pendente]**

## 3. Funcionalidades Extras (Implementadas)

* **Validação de Senha Forte:**
    * O endpoint de cadastro (`POST /users`) agora usa Regex para exigir uma senha forte.
* **Ferramentas de Moderação (Admin):**
    * `DELETE /users/:id`: (Admin) Permite que um administrador delete qualquer usuário.
    * `PATCH /users/:id/moderate-name`: (Admin) Reseta o nome de um usuário e o bloqueia por 3 semanas.
    * `PATCH /users/:id/unblock-name`: (Admin) Remove o bloqueio de alteração de nome.
    * A rota `PUT /auth/profile` foi atualizada para que o usuário obedeça ao bloqueio.

---
*Este README é específico para a branch `entrega/semanas-4-5`.*