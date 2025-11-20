import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateUser = () => {
    const timestamp = Date.now();
    return {
        name: `UserTest_${timestamp}`,
        email: `test_${timestamp}@example.com`,
        password: 'SenhaForte123!'
    };
};

describe('US-01 [AUTH] User Registration', () => {
    
    beforeAll(async () => {
        await prisma.user.deleteMany({
            where: { email: { contains: '@example.com' } }
        });
    });

    it('deve criar um novo usuário com sucesso (201)', async () => {
        const userData = generateUser();

        const response = await request(app)
            .post('/users')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(userData.email);
        expect(response.body).not.toHaveProperty('password');
    });

    it('deve rejeitar senha fraca (400)', async () => {
        const userData = generateUser();
        userData.password = '123'; // Senha fraca

        const response = await request(app)
            .post('/users')
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Password is too weak');
    });

    it('deve rejeitar email duplicado (409)', async () => {
        const userData = generateUser();

        // Cria o primeiro
        await request(app).post('/users').send(userData);

        // Tenta criar o segundo igual
        const response = await request(app)
            .post('/users')
            .send(userData);

        expect(response.status).toBe(409);
    });
});