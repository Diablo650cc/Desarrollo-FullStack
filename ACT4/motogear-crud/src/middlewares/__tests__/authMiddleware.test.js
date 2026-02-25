const { protect, checkProductOwner } = require('../../src/middlewares/authMiddleware');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/User');
jest.mock('../../src/models/Product');
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: ''
            },
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('protect', () => {
        it('debe permitir acceso con token válido', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com'
            };

            req.headers.authorization = 'Bearer valid-token';
            jwt.verify.mockReturnValue({ id: 'user123' });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            await protect(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        });

        it('debe rechazar si no hay token', async () => {
            req.headers.authorization = '';

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'No autorizado, token requerido'
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('debe rechazar si el token no comienza con Bearer', async () => {
            req.headers.authorization = 'Invalid-token';

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'No autorizado, token requerido'
            });
        });

        it('debe rechazar si el token es inválido', async () => {
            req.headers.authorization = 'Bearer invalid-token';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Token inválido'
            });
        });

        it('debe rechazar si el usuario no existe', async () => {
            req.headers.authorization = 'Bearer valid-token';
            jwt.verify.mockReturnValue({ id: 'user123' });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Usuario no encontrado'
            });
        });
    });

    describe('checkProductOwner', () => {
        beforeEach(() => {
            req.user = { _id: 'user123', role: 'user' };
            req.params.id = 'product123';
        });

        it('debe permitir acceso al propietario del producto', async () => {
            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco',
                usuario: 'user123'
            };

            Product.findById.mockResolvedValue(mockProduct);

            await checkProductOwner(req, res, next);

            expect(req.product).toEqual(mockProduct);
            expect(next).toHaveBeenCalled();
        });

        it('debe permitir acceso a un administrador', async () => {
            req.user.role = 'admin';

            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco',
                usuario: 'otherUser'
            };

            Product.findById.mockResolvedValue(mockProduct);

            await checkProductOwner(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('debe rechazar acceso si el usuario no es propietario', async () => {
            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco',
                usuario: 'otherUser'
            };

            Product.findById.mockResolvedValue(mockProduct);

            await checkProductOwner(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'No tienes permiso para modificar este producto'
            });
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            Product.findById.mockResolvedValue(null);

            await checkProductOwner(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Producto no encontrado'
            });
        });

        it('debe manejar errores de base de datos', async () => {
            Product.findById.mockRejectedValue(new Error('DB Error'));

            await checkProductOwner(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error verificando propietario'
            });
        });
    });
});
