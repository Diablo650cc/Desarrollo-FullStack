const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/User');
jest.mock('../../src/models/Product');
jest.mock('jsonwebtoken');

describe('Auth Routes Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('debe registrar un usuario exitosamente', async () => {
            const mockUser = {
                _id: '123456',
                email: 'newuser@example.com',
                password: 'hashedPassword'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mock-token');

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'newuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.email).toBe('newuser@example.com');
        });

        it('debe devolver error 400 con email duplicado', async () => {
            User.findOne.mockResolvedValue({ email: 'existing@example.com' });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('El usuario ya existe');
        });

        it('debe devolver error 400 sin email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Email y contraseña');
        });
    });

    describe('POST /api/auth/login', () => {
        it('debe iniciar sesión correctamente', async () => {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mock-token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('debe devolver error 401 con credenciales inválidas', async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Credenciales inválidas');
        });
    });

    describe('GET /api/auth/profile', () => {
        it('debe obtener el perfil del usuario autenticado', async () => {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com'
            };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });
            jwt.verify.mockReturnValue({ id: '123456' });

            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.email).toBe('test@example.com');
        });

        it('debe devolver error 401 sin token', async () => {
            const response = await request(app)
                .get('/api/auth/profile');

            expect(response.status).toBe(401);
        });
    });
});
