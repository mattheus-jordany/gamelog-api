import { Router } from 'express';

import { CreateGameController } from '../controllers/games/CreateGameController.js';
import { ListGamesController } from '../controllers/games/ListGamesController.js';
import { GetGameByIdController } from '../controllers/games/GetGameByIdController.js';
import { UpdateGameController } from '../controllers/games/UpdateGameController.js';
import { DeleteGameController } from '../controllers/games/DeleteGameController.js';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const gamesRoutes = Router();

const createGameController = new CreateGameController();
const listGamesController = new ListGamesController();
const getGameByIdController = new GetGameByIdController();
const updateGameController = new UpdateGameController();
const deleteGameController = new DeleteGameController();

gamesRoutes.post('/', ensureAuthenticated, ensureAdmin, createGameController.handle);

gamesRoutes.get('/', listGamesController.handle);

gamesRoutes.get('/:id', getGameByIdController.handle);

gamesRoutes.put('/:id', ensureAuthenticated, ensureAdmin, updateGameController.handle);

gamesRoutes.delete('/:id', ensureAuthenticated, ensureAdmin, deleteGameController.handle);

export { gamesRoutes };