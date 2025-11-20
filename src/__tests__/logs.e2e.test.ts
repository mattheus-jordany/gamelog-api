import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let userToken = '';
let gameId = '';

describe('[LOGS] User Game Logs', () => {
    
    beforeAll(async () => {
        await prisma.userGameLog.deleteMany();
        
        const user = await prisma.user.create({
            data: {
                name: 'LogTester',
                email: `log_${Date.now()}@test.com`, 
                password: 'hash',
                role: 'USER'
            }
        });
        
        userToken = jwt.sign({ role: 'USER' }, process.env.JWT_SECRET as string, { subject: user.id });

        const game = await prisma.game.create({
            data: {
                title: `Game for Log ${Date.now()}`,
                platform: 'PS5',
                genre: ['Adventure'],
                releaseYear: 2022
            }
        });
        gameId = game.id;
    });

    it('Deve adicionar um jogo ao log pessoal (201)', async () => {
        const response = await request(app)
            .post('/logs')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                gameId: gameId,
                status: 'PLAYING',
                rating: 9,
                comment: 'Jogando muito!'
            });

        expect(response.status).toBe(201);
        expect(response.body.gameId).toBe(gameId);
        expect(response.body.status).toBe('PLAYING');
    });

    it('Não deve permitir adicionar o mesmo jogo duas vezes (409)', async () => {
        const response = await request(app)
            .post('/logs')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                gameId: gameId,
                status: 'COMPLETED'
            });

        expect(response.status).toBe(409);
    });

    it('Deve listar os jogos do log do usuário (200)', async () => {
        const response = await request(app)
            .get('/logs/my')
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].game).toBeDefined();
    });
});