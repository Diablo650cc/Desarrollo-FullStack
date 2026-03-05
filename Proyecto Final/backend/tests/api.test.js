process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../db', () => ({
    getPool: jest.fn()
}));

const { getPool } = require('../db');
const app = require('../app');

function tokenFor(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('API integration (mocked db)', () => {
    let queryMock;

    beforeEach(() => {
        queryMock = jest.fn();
        getPool.mockReturnValue({ query: queryMock });
    });

    test('Login exitoso', async () => {
        const passwordHash = await bcrypt.hash('1234', 10);
        queryMock.mockResolvedValueOnce([[{ id: 1, email: 'user@test.com', password: passwordHash, role: 'user' }]]);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@test.com', password: '1234' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('user');
    });

    test('Login fallido', async () => {
        queryMock.mockResolvedValueOnce([[]]);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'none@test.com', password: '1234' });

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Credenciales invalidas/i);
    });

    test('Acceso permitido por rol admin', async () => {
        const adminToken = tokenFor({ id: '1', email: 'admin@test.com', role: 'admin' });
        queryMock
            .mockResolvedValueOnce([[{ total: 1 }]])
            .mockResolvedValueOnce([[{ id: 1, email: 'admin@test.com', role: 'admin', created_at: new Date() }]]);

        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
    });

    test('Acceso denegado por rol user', async () => {
        const userToken = tokenFor({ id: '2', email: 'user@test.com', role: 'user' });

        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
    });

    test('Crear registro producto', async () => {
        const userToken = tokenFor({ id: '2', email: 'user@test.com', role: 'user' });
        queryMock
            .mockResolvedValueOnce([{ insertId: 22 }])
            .mockResolvedValueOnce([[{
                id: 22,
                nombre: 'Casco Pro',
                descripcion: 'Integral',
                categoria: 'Cascos',
                precio: 100,
                talla: 'M',
                color: 'Negro',
                stock: 5,
                status: 'active',
                usuario_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            }]]);

        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ nombre: 'Casco Pro', categoria: 'Cascos', precio: 100, stock: 5 });

        expect(response.status).toBe(201);
        expect(response.body.nombre).toBe('Casco Pro');
    });

    test('Listar registros', async () => {
        const userToken = tokenFor({ id: '2', email: 'user@test.com', role: 'user' });
        queryMock
            .mockResolvedValueOnce([[{ total: 2 }]])
            .mockResolvedValueOnce([[{
                id: 1,
                nombre: 'Prod 1',
                descripcion: '',
                categoria: 'Cascos',
                precio: 10,
                talla: '',
                color: '',
                stock: 2,
                status: 'active',
                usuario_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            }]]);

        const response = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Validacion fallida al crear producto', async () => {
        const userToken = tokenFor({ id: '2', email: 'user@test.com', role: 'user' });

        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ nombre: '', categoria: '', precio: -1 });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/Nombre es requerido/i);
    });

    test('Paginacion y filtros', async () => {
        const adminToken = tokenFor({ id: '1', email: 'admin@test.com', role: 'admin' });
        queryMock
            .mockResolvedValueOnce([[{ total: 5 }]])
            .mockResolvedValueOnce([[{
                id: 7,
                nombre: 'Casco ADV',
                descripcion: 'Con visera',
                categoria: 'Cascos',
                precio: 250,
                talla: 'L',
                color: 'Rojo',
                stock: 3,
                status: 'active',
                usuario_id: 1,
                created_at: new Date(),
                updated_at: new Date()
            }]]);

        const response = await request(app)
            .get('/api/products?page=2&limit=1&search=Casco&categoria=Cascos&status=active')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.pagination.page).toBe(2);
        expect(response.body.filters.categoria).toBe('Cascos');
    });
});
