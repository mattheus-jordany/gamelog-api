import { Router } from 'express';
import { CreateUserController } from '../controllers/users/CreateUserController.js';
import { ListUsersController } from '../controllers/users/ListUsersController.js';
import { DeleteUserController } from '../controllers/users/DeleteUserController.js';
import { ModerateNameController } from '../controllers/users/ModerateNameController.js';
import { UnblockUserNameController } from '../controllers/users/UnblockUserNameController.js';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUsersController = new ListUsersController();
const deleteUserController = new DeleteUserController();
const moderateNameController = new ModerateNameController();
const unblockUserNameController = new UnblockUserNameController();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gerenciamento de usuários e moderação (Admin)
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *           examples:
 *             createUserExample:
 *               $ref: '#/components/examples/createUserExample'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Requisição inválida — senha é obrigatória e deve atender aos critérios de segurança
 *       409:
 *         description: Email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista usuários (Admin)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Número da página (padrão: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Itens por página (padrão: 10)"
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       403:
 *         description: Acesso negado — apenas administradores
 *       500:
 *         description: Erro interno do servidor
 */
usersRoutes.post('/', createUserController.handle);
usersRoutes.get('/', ensureAuthenticated, ensureAdmin, listUsersController.handle);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID (Admin)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso (sem conteúdo)
 *       400:
 *         description: Requisição inválida — ID do usuário está faltando ou inválido
 *       403:
 *         description: Acesso negado — administradores não podem se autoexcluir
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
usersRoutes.delete('/:id', ensureAuthenticated, ensureAdmin, deleteUserController.handle);

/**
 * @swagger
 * /users/{id}/moderate-name:
 *   patch:
 *     summary: Modera o nome de um usuário (Admin)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Nome moderado com sucesso
 *       400:
 *         description: Requisição inválida — ID do usuário está faltando ou inválido
 *       403:
 *         description: Acesso negado — administrador não pode moderar o próprio nome
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
usersRoutes.patch('/:id/moderate-name', ensureAuthenticated, ensureAdmin, moderateNameController.handle);

/**
 * @swagger
 * /users/{id}/unblock-name:
 *   patch:
 *     summary: Desbloqueia o nome de um usuário (Admin)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Nome desbloqueado com sucesso
 *       400:
 *         description: Requisição inválida — ID do usuário está faltando ou inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
usersRoutes.patch('/:id/unblock-name', ensureAuthenticated, ensureAdmin, unblockUserNameController.handle);

export { usersRoutes };