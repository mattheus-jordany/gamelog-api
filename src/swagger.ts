import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

// Detecta se estamos rodando a partir de `dist` (build) ou do código-fonte
const projectRoot = process.cwd();
const distRoutesPath = path.join(projectRoot, 'dist', 'src', 'http', 'routes');
const srcRoutesPath = path.join(projectRoot, 'src', 'http', 'routes');

const apiGlobs = [] as string[];
if (fs.existsSync(distRoutesPath)) {
  // quando rodando a partir do build, use os arquivos .js compilados
  apiGlobs.push('./dist/src/http/routes/*.js');
} else {
  // durante desenvolvimento/testes, use os arquivos .ts da fonte
  apiGlobs.push('./src/http/routes/*.ts');
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GameLog API',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento de jogos pessoais.',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            avatarUrl: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
          },
        },
        Game: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            platform: { type: 'string' },
            genre: { type: 'array', items: { type: 'string' } },
            releaseYear: { type: 'integer' },
            coverUrl: { type: 'string' },
          },
        },
        UserGameLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            rating: { type: 'integer', minimum: 0, maximum: 10 },
            status: { type: 'string', enum: ['PLAYING', 'COMPLETED', 'ON_BACKLOG', 'DROPPED'] },
            comment: { type: 'string' },
            playtimeHours: { type: 'number' },
          },
        },
        AuthToken: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        GenericMessage: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      examples: {
        loginExample: {
          summary: 'Exemplo de login',
          value: {
            email: 'user@example.com',
            password: 'StrongPass!23'
          }
        },
        createUserExample: {
          summary: 'Exemplo de cadastro de usuário',
          value: {
            name: 'Usuario Exemplo',
            email: 'user@example.com',
            password: 'StrongPass!23'
          }
        },
        createGameExample: {
          summary: 'Exemplo de criação de jogo',
          value: {
            title: 'Hollow Knight',
            platform: 'PC',
            genre: ['Metroidvania'],
            releaseYear: 2017
          }
        },
        updateGameExample: {
          summary: 'Exemplo de atualização de jogo',
          value: {
            title: 'Hollow Knight: Silksong',
            platform: 'PC',
            genre: ['Metroidvania', 'Action'],
            releaseYear: 2025,
            coverUrl: 'https://example.com/covers/hollow.jpg'
          }
        },
        updateProfileExample: {
          summary: 'Exemplo de atualização de perfil',
          value: {
            name: 'Novo Nome',
            avatarUrl: 'https://example.com/avatar.png'
          }
        },
        forgotPasswordExample: {
          summary: 'Exemplo de solicitação de recuperação',
          value: { email: 'user@example.com' }
        },
        resetPasswordExample: {
          summary: 'Exemplo de redefinição de senha',
          value: { token: 'abcdef123456', password: 'newStrongPassword1', password_confirmation: 'newStrongPassword1' }
        },
        createLogExample: {
          summary: 'Exemplo de adição ao log',
          value: {
            gameId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            status: 'PLAYING',
            rating: 8,
            comment: 'Jogo incrível, levei 30 horas'
          }
        },
        updateLogExample: {
          summary: 'Exemplo de atualização de log',
          value: {
            status: 'COMPLETED',
            rating: 9,
            comment: 'Finalizado com platina',
            playtimeHours: 45,
            isPlatininated: true
          }
        },
        avatarUploadExample: {
          summary: 'Exemplo de envio de avatar',
          value: { avatar: '(<file>)' }
        }
      },
    },
  },
  apis: apiGlobs,
};

let _swaggerSpec: any = null;
try {
  _swaggerSpec = swaggerJsdoc(options);
} catch (error) {
  console.error('Failed to generate swaggerSpec:', (error as any) && (error as any).message ? (error as any).message : error);
}
export const swaggerSpec: any = _swaggerSpec;