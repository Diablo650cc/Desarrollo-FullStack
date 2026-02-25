const { register, login, getProfile } = require('../../src/controllers/authController');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('debe registrar un usuario exitosamente', async () => {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                password: 'hashedPassword'
            };

            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mock-token');

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                _id: '123456',
                email: 'test@example.com',
                token: 'mock-token'
            });
        });

        it('debe devolver error 400 si email o contraseña no están presentes', async () => {
            req.body = { email: 'test@example.com' };

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Email y contraseña son requeridos'
            });
        });

        it('debe devolver error 400 si el usuario ya existe', async () => {
            req.body = {
                email: 'existing@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ email: 'existing@example.com' });

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'El usuario ya existe'
            });
        });

        it('debe devolver error 500 si ocurre una excepción', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockRejectedValue(new Error('DB Error'));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Error registrando usuario'
                })
            );
        });
    });

    describe('login', () => {
        it('debe iniciar sesión correctamente', async () => {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mock-token');

            await login(req, res);

            expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
            expect(res.json).toHaveBeenCalledWith({
                _id: '123456',
                email: 'test@example.com',
                token: 'mock-token'
            });
        });

        it('debe devolver error 400 si email o contraseña no están presentes', async () => {
            req.body = { email: 'test@example.com' };

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Email y contraseña son requeridos'
            });
        });

        it('debe devolver error 401 si el usuario no existe', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Credenciales inválidas'
            });
        });

        it('debe devolver error 401 si la contraseña es incorrecta', async () => {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            req.body = {
                email: 'test@example.com',
                password: 'wrongPassword'
            };

            User.findOne.mockResolvedValue(mockUser);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Credenciales inválidas'
            });
        });
    });

    describe('getProfile', () => {
        it('debe devolver el perfil del usuario autenticado', async () => {
            req.user = {
                _id: '123456',
                email: 'test@example.com'
            };

            await getProfile(req, res);

            expect(res.json).toHaveBeenCalledWith(req.user);
        });
    });
});
