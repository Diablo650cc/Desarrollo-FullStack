const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

describe('Product Management API', () => {
    let authToken;
    let userId;
    let productId;

    beforeAll(async () => {
        // Conectar a base de datos de prueba
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-app-test';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Limpiar colecciones
        await User.deleteMany({});
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Authentication', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');

            authToken = res.body.token;
            userId = res.body.user.id;
        });

        it('should not register with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test2@example.com'
                });

            expect(res.statusCode).toBe(400);
        });

        it('should not register duplicate user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toContain('ya existe');
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            authToken = res.body.token;
        });

        it('should not login with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('Products CRUD', () => {
        it('should create a new product', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    nombre: 'Laptop',
                    descripcion: 'High-performance laptop',
                    categoria: 'Electrónica',
                    precio: 999.99,
                    talla: 'N/A',
                    color: 'Gris',
                    stock: 5
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.nombre).toBe('Laptop');
            productId = res.body._id;
        });

        it('should get all products', async () => {
            const res = await request(app)
                .get('/api/products')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should get a specific product', async () => {
            const res = await request(app)
                .get(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(productId);
        });

        it('should update a product', async () => {
            const res = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    nombre: 'Updated Laptop',
                    precio: 1099.99
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.nombre).toBe('Updated Laptop');
            expect(res.body.precio).toBe(1099.99);
        });

        it('should delete a product', async () => {
            const res = await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);

            // Verify deletion
            const getRes = await request(app)
                .get(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getRes.statusCode).toBe(404);
        });

        it('should not create product without auth', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    nombre: 'Test Product',
                    categoria: 'Test',
                    precio: 99.99
                });

            expect(res.statusCode).toBe(401);
        });
    });
});
