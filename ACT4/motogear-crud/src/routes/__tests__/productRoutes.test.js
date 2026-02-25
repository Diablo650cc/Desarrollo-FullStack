const request = require('supertest');
const app = require('../../src/app');
const Product = require('../../src/models/Product');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/Product');
jest.mock('../../src/models/User');
jest.mock('jsonwebtoken');

describe('Product Routes Integration', () => {
    let mockUser;
    let mockProducts;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUser = {
            _id: 'user123',
            email: 'test@example.com'
        };

        mockProducts = [
            {
                _id: 'product1',
                nombre: 'Casco',
                categoria: 'Cascos',
                precio: 150,
                talla: 'M',
                color: 'Negro',
                stock: 5,
                usuario: mockUser
            },
            {
                _id: 'product2',
                nombre: 'Chaqueta',
                categoria: 'Chaquetas',
                precio: 200,
                talla: 'L',
                color: 'Azul',
                stock: 3,
                usuario: mockUser
            }
        ];

        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });
        jwt.verify.mockReturnValue({ id: 'user123' });
    });

    describe('GET /api/products', () => {
        it('debe obtener todos los productos', async () => {
            Product.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProducts)
            });

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('debe manejar errores al obtener productos', async () => {
            Product.find.mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('DB Error'))
            });

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('Error obteniendo productos');
        });
    });

    describe('GET /api/products/:id', () => {
        it('debe obtener un producto por ID', async () => {
            Product.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProducts[0])
            });

            const response = await request(app)
                .get('/api/products/product1');

            expect(response.status).toBe(200);
            expect(response.body.nombre).toBe('Casco');
            expect(response.body._id).toBe('product1');
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            Product.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const response = await request(app)
                .get('/api/products/nonexistent');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Producto no encontrado');
        });
    });

    describe('POST /api/products', () => {
        it('debe crear un producto exitosamente', async () => {
            const newProduct = {
                _id: 'product3',
                nombre: 'Guantes',
                categoria: 'Guantes',
                precio: 80,
                talla: 'M',
                color: 'Rojo',
                stock: 10,
                usuario: mockUser._id
            };

            Product.create.mockResolvedValue(newProduct);

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    nombre: 'Guantes',
                    categoria: 'Guantes',
                    precio: 80,
                    talla: 'M',
                    color: 'Rojo',
                    stock: 10
                });

            expect(response.status).toBe(201);
            expect(response.body.nombre).toBe('Guantes');
        });

        it('debe devolver error 400 sin campos requeridos', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    nombre: 'Guantes'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('campos son requeridos');
        });

        it('debe devolver error 401 sin token', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    nombre: 'Guantes',
                    categoria: 'Guantes',
                    precio: 80,
                    talla: 'M',
                    color: 'Rojo'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('debe actualizar un producto exitosamente', async () => {
            const updatedProduct = {
                ...mockProducts[0],
                precio: 180,
                nombre: 'Casco Premium'
            };

            Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

            const response = await request(app)
                .put('/api/products/product1')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    precio: 180,
                    nombre: 'Casco Premium'
                });

            expect(response.status).toBe(200);
            expect(response.body.precio).toBe(180);
            expect(response.body.nombre).toBe('Casco Premium');
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            Product.findByIdAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/products/nonexistent')
                .set('Authorization', 'Bearer valid-token')
                .send({ precio: 180 });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Producto no encontrado');
        });

        it('debe devolver error 401 sin token', async () => {
            const response = await request(app)
                .put('/api/products/product1')
                .send({ precio: 180 });

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('debe eliminar un producto exitosamente', async () => {
            Product.findById.mockResolvedValue({
                usuario: mockUser._id,
                deleteOne: jest.fn().mockResolvedValue({})
            });

            const response = await request(app)
                .delete('/api/products/product1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Producto eliminado correctamente');
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            Product.findById.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/products/nonexistent')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(404);
        });

        it('debe devolver error 401 sin token', async () => {
            const response = await request(app)
                .delete('/api/products/product1');

            expect(response.status).toBe(401);
        });

        it('debe devolver error 403 si no es propietario', async () => {
            Product.findById.mockResolvedValue({
                usuario: 'differentUser',
                deleteOne: jest.fn()
            });

            const response = await request(app)
                .delete('/api/products/product1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(403);
        });
    });
});
