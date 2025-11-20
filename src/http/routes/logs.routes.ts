import { Router } from "express";
import { CreateUserGameLogController } from "../controllers/logs/CreateUserGameLogController.js";
import { ListUserGameLogsController } from "../controllers/logs/ListUserGameLogsController.js";
import { UpdateUserGameLogController } from "../controllers/logs/UpdateUserGameLogController.js";
import { DeleteUserGameLogController } from "../controllers/logs/DeleteUserGameLogController.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";

const logsRoutes = Router();

const createUserGameLogController = new CreateUserGameLogController();
const listUserGameLogsController = new ListUserGameLogsController();
const updateUserGameLogController = new UpdateUserGameLogController();
const deleteUserGameLogController = new DeleteUserGameLogController();

/**
 * @swagger
 * tags:
 *   - name: Logs
 *     description: Gerenciamento do log pessoal de jogos (MyGameList)
 */

/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Adiciona um jogo ao log pessoal do usuário
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do jogo a ser adicionado
 *               status:
 *                 type: string
 *                 enum: [PLAYING, COMPLETED, ON_BACKLOG, DROPPED]
 *                 default: PLAYING
 *               rating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *               comment:
 *                 type: string
 *                 maxLength: 300
 *           examples:
 *             createLogExample:
 *               $ref: '#/components/examples/createLogExample'
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGameLog'
 *       400:
 *         description: Requisição inválida — dados ausentes ou inválidos
 *       404:
 *         description: Jogo não encontrado no catálogo
 *       409:
 *         description: Jogo já está no log do usuário
 *       500:
 *         description: Erro interno do servidor
 */
logsRoutes.post("/", ensureAuthenticated, createUserGameLogController.handle);

/**
 * @swagger
 * /logs/my:
 *   get:
 *     summary: Lista os logs pessoais do usuário autenticado
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserGameLog'
 *                 meta:
 *                   type: object
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */
logsRoutes.get("/my", ensureAuthenticated, listUserGameLogsController.handle);

/**
 * @swagger
 * /logs/{id}:
 *   put:
 *     summary: Atualiza um registro de log existente
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro de log (não do jogo)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLAYING, COMPLETED, ON_BACKLOG, DROPPED]
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *               playtimeHours:
 *                 type: number
 *               isPlatininated:
 *                 type: boolean
 *           examples:
 *             updateLogExample:
 *               $ref: '#/components/examples/updateLogExample'
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGameLog'
 *       400:
 *         description: Requisição inválida — Log ID inválido ou dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Registro de log não encontrado ou usuário não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
logsRoutes.put("/:id", ensureAuthenticated, updateUserGameLogController.handle);

/**
 * @swagger
 * /logs/{id}:
 *   delete:
 *     summary: Remove um registro do log pessoal
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro de log
 *     responses:
 *       204:
 *         description: Registro removido com sucesso (sem conteúdo)
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Registro de log não encontrado ou usuário não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
logsRoutes.delete(
  "/:id",
  ensureAuthenticated,
  deleteUserGameLogController.handle
);

export { logsRoutes };
