import { Router } from 'express';
import { CreateGameController } from '../controllers/games/CreateGameController.js';

// Importamos nossos "seguranças"
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const gamesRoutes = Router();

const createGameController = new CreateGameController();

gamesRoutes.post('/', ensureAuthenticated, ensureAdmin, createGameController.handle);

export { gamesRoutes };