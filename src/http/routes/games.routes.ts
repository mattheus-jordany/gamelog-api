import { Router } from "express";
import { CreateGameController } from "../controllers/games/CreateGameController.js";
import { ListGamesController } from "../controllers/games/ListGamesController.js";
import { GetGameByIdController } from "../controllers/games/GetGameByIdController.js";
import { UpdateGameController } from "../controllers/games/UpdateGameController.js";
import { DeleteGameController } from "../controllers/games/DeleteGameController.js";
import { UploadGameCoverController } from "../controllers/games/UploadGameCoverController.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";
import { upload } from "../../config/multer.js";

const gamesRoutes = Router();
const createGameController = new CreateGameController();
const listGamesController = new ListGamesController();
const getGameByIdController = new GetGameByIdController();
const updateGameController = new UpdateGameController();
const deleteGameController = new DeleteGameController();
const uploadGameCoverController = new UploadGameCoverController();

/**
 * @swagger
 * tags:
 *   - name: Games
 *     description: Catálogo de Jogos
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Cria um novo jogo
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - platform
 *               - genre
 *               - releaseYear
 *             properties:
 *               title:
 *                 type: string
 *               platform:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               releaseYear:
 *                 type: integer
 *           examples:
 *             createGameExample:
 *               $ref: '#/components/examples/createGameExample'
 *     responses:
 *       201:
 *         description: Sucesso (jogo criado)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Requisição inválida — campos inválidos ou ausentes
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado — apenas administradores
 *       409:
 *         description: Um jogo com este título já existe
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista jogos cadastrados
 *     tags:
 *       - Games
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de jogos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *                 meta:
 *                   type: object
 *       500:
 *         description: Erro interno do servidor
 */
gamesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createGameController.handle
);
gamesRoutes.get("/", listGamesController.handle);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Recupera um jogo por ID
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do jogo
 *     responses:
 *       200:
 *         description: Jogo retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: ID do jogo não enviado ou inválido
 *       404:
 *         description: Jogo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
gamesRoutes.get("/:id", getGameByIdController.handle);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Atualiza dados do jogo
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do jogo
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               platform:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               releaseYear:
 *                 type: integer
 *               coverUrl:
 *                 type: string
 *           examples:
 *             updateGameExample:
 *               $ref: '#/components/examples/updateGameExample'
 *     responses:
 *       200:
 *         description: Jogo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Requisição inválida — ID ou dados inválidos
 *       403:
 *         description: Acesso negado — apenas administradores
 *       404:
 *         description: Jogo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
gamesRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateGameController.handle
);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Remove um jogo
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Jogo removido com sucesso (sem conteúdo)
 *       400:
 *         description: ID do jogo não enviado ou inválido
 *       403:
 *         description: Acesso negado — apenas administradores
 *       404:
 *         description: Jogo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
gamesRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  deleteGameController.handle
);

/**
 * @swagger
 * /games/{id}/cover:
 *   patch:
 *     summary: Upload da capa do jogo
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *           examples:
 *             coverUploadExample:
 *               $ref: '#/components/examples/avatarUploadExample'
 *     responses:
 *       200:
 *         description: Capa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Nenhum arquivo enviado ou Game ID inválido/inexistente
 *       403:
 *         description: Acesso negado — apenas administradores
 *       404:
 *         description: Jogo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
gamesRoutes.patch(
  "/:id/cover",
  ensureAuthenticated,
  ensureAdmin,
  upload.single("cover"),
  uploadGameCoverController.handle
);

export { gamesRoutes };
