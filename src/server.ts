import express from 'express';
import { usersRoutes } from './http/routes/users.routes.js';
import { gamesRoutes } from './http/routes/games.routes.js';
import { authRoutes } from './http/routes/auth.routes.js';
import { logsRoutes } from './http/routes/logs.routes.js';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/games', gamesRoutes);
app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);

app.get('/', (request, response) => {
  return response.json({ message: 'GameLog API is running!' });
});
 
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor esta rodando na porta ${PORT}`);
});