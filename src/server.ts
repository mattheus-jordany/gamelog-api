import express from 'express';
import { usersRoutes } from './http/routes/users.routes.js';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);

// Uma rota de teste simples para verificar se o servidor está no ar
app.get('/', (request, response) => {
  return response.json({ message: 'GameLog API is running!' });
});
 
// Define a porta em que o servidor vai rodar
const PORT = 8080;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor esta rodando na porta ${PORT}`);
});