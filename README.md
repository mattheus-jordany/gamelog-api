# Entrega Semanas 1-2: GameLog API

Este documento registra o progresso do projeto GameLog API até a data de entrega referente às semanas 1 e 2 do desafio de back-end.

## Funcionalidades Implementadas (Até esta data)

* **Ambiente:** Projeto totalmente conteinerizado com Docker e Docker Compose, utilizando Node.js v18 e TypeScript. Ambiente configurado para desenvolvimento com reinício automático (`nodemon` + `tsc`). Variáveis de ambiente gerenciadas com `.env` e `.env.example`.
* **Banco de Dados:** Modelagem inicial do banco de dados PostgreSQL utilizando Prisma ORM. Migrations criadas e aplicadas para definir as tabelas `User`, `Game` e `UserGameLog` com seus relacionamentos e campos iniciais (incluindo `enums` para `Role`, `RecommendationStatus`, `GameStatus`, campos opcionais e constraints `@unique`). Instância única do Prisma Client implementada (`Singleton`).
* **Autenticação (Parcial):**
    * Endpoint `POST /users` para cadastro de novos usuários com hashing de senha (`bcryptjs`) e validação de email/nome únicos.
    * Endpoint `POST /users/sessions` para login, comparando senhas com `bcryptjs` e gerando tokens JWT.
* **Autorização (Middlewares):**
    * Middleware `ensureAuthenticated` implementado para validar tokens JWT.
    * Middleware `ensureAdmin` implementado para verificar a role do usuário.
    * Rota de teste `GET /users/profile` (protegida por `ensureAuthenticated`).
    * Rota de teste `GET /users` (protegida por `ensureAuthenticated` e `ensureAdmin`).

## Experiência e Desafios

Durante estas primeiras semanas, o maior desafio foi a configuração inicial do ambiente Docker com Node.js/TypeScript e ES Modules, o que exigiu depuração detalhada de erros de inicialização e sincronização de arquivos no Windows/WSL. A persistência em resolver esses problemas resultou em um ambiente de desenvolvimento estável e robusto. A modelagem do banco com Prisma foi uma experiência positiva, e a implementação da autenticação com JWT e bcrypt seguiu as melhores práticas de segurança. O projeto está adiantado em relação ao cronograma inicial.

---
*Este README é específico para a branch `entrega/semanas-1-2`.*