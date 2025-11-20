import express from 'express';
import { usersRoutes } from './http/routes/users.routes.js';
import { gamesRoutes } from './http/routes/games.routes.js';
import { authRoutes } from './http/routes/auth.routes.js';
import { logsRoutes } from './http/routes/logs.routes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/games', gamesRoutes);
app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);

if (swaggerSpec) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  // eslint-disable-next-line no-console
  console.warn('Swagger spec not available — /api-docs disabled');
}

// Endpoint de diagnóstico para inspecionar o Swagger JSON gerado
app.get('/swagger.json', (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  if (!swaggerSpec) {
    return response.status(503).json({ error: 'Swagger spec not available' });
  }

  return response.json(swaggerSpec);
});

app.get('/', (request, response) => {
  return response.json({ message: 'GameLog API is running!' });
});
 
export default app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor esta rodando na porta ${PORT}`);
  });
};