import { Router } from 'express';
import { CreateGameController } from '../controllers/games/CreateGameController.js';
import { ListGamesController } from '../controllers/games/ListGamesController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const gamesRoutes = Router();

const createGameController = new CreateGameController();
const listGamesController = new ListGamesController();

gamesRoutes.post('/', ensureAuthenticated, ensureAdmin, createGameController.handle);

gamesRoutes.get('/', listGamesController.handle);

export { gamesRoutes };