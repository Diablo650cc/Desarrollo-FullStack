const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

describe('Database Models', () => {
    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-app-test';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
    });

    describe('User Model', () => {
        it('should create a user with hashed password', async () => {
            const user = new User({
                email: 'test@example.com',
                password: 'password123'
            });

            await user.save();

            expect(user._id).toBeDefined();
            expect(user.email).toBe('test@example.com');
            expect(user.password).not.toBe('password123'); // Password should be hashed
        });

        it('should validate email format', async () => {
            const user = new User({
                email: 'invalidemail',
                password: 'password123'
            });

            try {
                await user.save();
                fail('Should throw validation error');
            } catch (err) {
                expect(err.errors.email).toBeDefined();
            }
        });

        it('should match password correctly', async () => {
            const user = new User({
                email: 'test@example.com',
                password: 'password123'
            });

            await user.save();

            const isMatch = await user.matchPassword('password123');
            expect(isMatch).toBe(true);

            const isNotMatch = await user.matchPassword('wrongpassword');
            expect(isNotMatch).toBe(false);
        });

        it('should reject duplicate emails', async () => {
            const user1 = new User({
                email: 'test@example.com',
                password: 'password123'
            });

            await user1.save();

            const user2 = new User({
                email: 'test@example.com',
                password: 'password456'
            });

            try {
                await user2.save();
                fail('Should throw duplicate key error');
            } catch (err) {
                expect(err.message).toContain('duplicate');
            }
        });
    });

    describe('Product Model', () => {
        let userId;

        beforeEach(async () => {
            const user = new User({
                email: 'test@example.com',
                password: 'password123'
            });

            const savedUser = await user.save();
            userId = savedUser._id;
        });

        it('should create a product', async () => {
            const product = new Product({
                nombre: 'Test Product',
                descripcion: 'A test product',
                categoria: 'Test',
                precio: 99.99,
                talla: 'M',
                color: 'Red',
                stock: 10,
                usuario: userId
            });

            const savedProduct = await product.save();

            expect(savedProduct._id).toBeDefined();
            expect(savedProduct.nombre).toBe('Test Product');
            expect(savedProduct.usuario.toString()).toBe(userId.toString());
        });

        it('should require required fields', async () => {
            const product = new Product({
                usuario: userId
            });

            try {
                await product.save();
                fail('Should throw validation error');
            } catch (err) {
                expect(err.errors.nombre).toBeDefined();
                expect(err.errors.categoria).toBeDefined();
                expect(err.errors.precio).toBeDefined();
            }
        });

        it('should set createdAt and updatedAt', async () => {
            const product = new Product({
                nombre: 'Test Product',
                descripcion: 'A test product',
                categoria: 'Test',
                precio: 99.99,
                stock: 10,
                usuario: userId
            });

            const savedProduct = await product.save();

            expect(savedProduct.createdAt).toBeDefined();
            expect(savedProduct.updatedAt).toBeDefined();
        });

        it('should allow updating product', async () => {
            const product = new Product({
                nombre: 'Test Product',
                descripcion: 'A test product',
                categoria: 'Test',
                precio: 99.99,
                stock: 10,
                usuario: userId
            });

            await product.save();

            product.nombre = 'Updated Product';
            product.precio = 149.99;
            const updatedProduct = await product.save();

            expect(updatedProduct.nombre).toBe('Updated Product');
            expect(updatedProduct.precio).toBe(149.99);
        });
    });
});
