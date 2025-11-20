# GameLog API - Documentação Final

## 📝 Visão Geral do Projeto

A **GameLog API** é um sistema back-end robusto construído para gerenciar o catálogo pessoal de jogos, registrando progresso, notas e status de platinamento de cada usuário. Este projeto atende a todos os requisitos obrigatórios do desafio de especialização em Back-end da Comp Júnior.

A arquitetura segue o padrão RESTful, utilizando TypeScript para segurança de código, Docker para containerização e PostgreSQL como banco de dados.

## 🔗 Links Úteis

* **Documentação Interativa da API (Swagger UI):** `http://localhost:8080/api-docs`
* **Vídeo de Apresentação:** [LINK DO VÍDEO]

## 🛠️ Stack Tecnológica

| Componente | Tecnologia | Função no Projeto |
| :--- | :--- | :--- |
| **Ambiente** | Node.js (v18) + TypeScript | Linguagem e Ambiente de execução tipado e seguro. |
| **Framework** | Express.js (v4) | Framework minimalista e estável para roteamento da API. |
| **Banco de Dados** | PostgreSQL | Armazenamento persistente e relacional (Dockerizado). |
| **ORM** | Prisma | Mapeamento Objeto-Relacional (Gera consultas SQL seguras). |
| **Segurança** | JWT & Bcrypt | Tokens para autenticação e hashing de senhas. |
| **Container** | Docker & Docker Compose | Containerização para deploy rápido e ambientes consistentes. |
| **Integração** | Multer & Cloudinary | **"Ir Além"**: Upload de imagens de capa e avatar. |
| **E-mail** | Nodemailer (Ethereal) | **"Ir Além"**: Envio de e-mails para recuperação de senha (simulado em DEV). |

## 🚀 Como Executar o Projeto (Instruções de Deploy)

### Pré-requisitos

Você precisa ter instalado em sua máquina:

1.  **Git**
2.  **Node.js** (para comandos NPM)
3.  **Docker Desktop** (Obrigatório para o ambiente)
4.  **Conta no Cloudinary** (para a funcionalidade de upload)

### Passos

1.  **Clone o Repositório:**

    ```bash
    git clone [LINK_DO_SEU_REPOSITORIO]
    cd gamelog-api
    ```

2.  **Configurar Variáveis de Ambiente:**

      * Crie uma cópia do arquivo de exemplo: `cp .env.example .env`
      * **Preencha o arquivo `.env`** com suas credenciais do Cloudinary e o `JWT_SECRET`.

3.  **Subir o Ambiente com Docker:**

    ```bash
    docker-compose up -d --build
    ```

4.  **Criar o Schema no Banco de Dados:**

    ```bash
    docker-compose exec api npx prisma migrate dev
    ```

5.  **Iniciar a Aplicação:**

      * Sua API estará rodando em `http://localhost:8080`.

## 🔒 Funcionalidades Implementadas

### CRUD Completo (Entidades & Rotas)

| Método | Endpoint | Middleware | Função |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Nenhum | Cria novo usuário (Cadastro). **Validação de senha forte.** |
| `POST` | `/auth/sessions` | Nenhum | Realiza o login e retorna um token JWT. |
| `GET` | `/auth/profile` | Autenticado | Retorna os dados do usuário logado. |
| `PUT` | `/auth/profile` | Autenticado | Atualiza nome/avatar do usuário. Implementa trava de moderação de nome. |
| `DELETE` | `/auth/profile` | Autenticado | Deleta a conta do usuário logado. |
| `PATCH`| `/auth/profile/avatar` | Autenticado | Faz upload do avatar para o Cloudinary. |
| `POST` | `/auth/forgot-password` | Nenhum | Gera token e envia link por e-mail (Nodemailer). |
| `POST` | `/auth/reset-password` | Nenhum | Redefine a senha com o token. |
| `POST` | `/games` | **Admin** | Adiciona um novo jogo ao catálogo. |
| `GET` | `/games` | Nenhum | Lista todos os jogos cadastrados (com paginação). |
| `PUT` | `/games/:id` | **Admin** | Atualiza os dados de um jogo. |
| `DELETE` | `/games/:id` | **Admin** | Deleta um jogo do catálogo. |
| `PATCH`| `/games/:id/cover` | **Admin** | Faz upload da capa do jogo para o Cloudinary. |
| `POST` | `/logs` | Autenticado | Adiciona um jogo ao log pessoal do usuário. |
| `GET` | `/logs/my` | Autenticado | Lista todos os logs do usuário logado. |
| `PUT` | `/logs/:id` | Autenticado | Atualiza o registro do log (nota, status, comentário). |
| `DELETE` | `/logs/:id` | Autenticado | Deleta um registro do log. |
| `GET` | `/users` | **Admin** | Lista todos os usuários (ferramenta de gestão). |
| `DELETE`| `/users/:id` | **Admin** | Deleta um usuário pelo ID. |
| `PATCH`| `/users/:id/moderate-name` | **Admin** | Reseta o nome e bloqueia a alteração por 3 semanas. |
| `PATCH`| `/users/:id/unblock-name` | **Admin** | Remove o bloqueio de alteração de nome. |