import express from 'express';
import { usersRoutes } from './http/routes/users.routes.js';
import { gamesRoutes } from './http/routes/games.routes.js';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/games', gamesRoutes);

app.get('/', (request, response) => {
  return response.json({ message: 'GameLog API is running!' });
});
 
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor esta rodando na porta ${PORT}`);
});