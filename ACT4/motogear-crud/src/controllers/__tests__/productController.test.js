const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../../src/controllers/productController');
const Product = require('../../src/models/Product');

jest.mock('../../src/models/Product');

describe('Product Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: {
                _id: 'user123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('getProducts', () => {
        it('debe obtener todos los productos', async () => {
            const mockProducts = [
                {
                    _id: '1',
                    nombre: 'Casco',
                    categoria: 'Cascos',
                    precio: 150,
                    usuario: { email: 'user@example.com' }
                },
                {
                    _id: '2',
                    nombre: 'Chaqueta',
                    categoria: 'Chaquetas',
                    precio: 200,
                    usuario: { email: 'user@example.com' }
                }
            ];

            Product.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProducts)
            });

            await getProducts(req, res);

            expect(Product.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        it('debe manejar errores al obtener productos', async () => {
            Product.find.mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('DB Error'))
            });

            await getProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Error obteniendo productos'
                })
            );
        });
    });

    describe('getProductById', () => {
        it('debe obtener un producto por ID', async () => {
            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco',
                categoria: 'Cascos',
                precio: 150,
                usuario: { email: 'user@example.com' }
            };

            req.params.id = 'product123';

            Product.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProduct)
            });

            await getProductById(req, res);

            expect(Product.findById).toHaveBeenCalledWith('product123');
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            req.params.id = 'nonexistent';

            Product.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            await getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Producto no encontrado'
            });
        });

        it('debe manejar errores al obtener un producto', async () => {
            req.params.id = 'product123';

            Product.findById.mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('DB Error'))
            });

            await getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Error obteniendo producto'
                })
            );
        });
    });

    describe('createProduct', () => {
        it('debe crear un producto exitosamente', async () => {
            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco',
                categoria: 'Cascos',
                precio: 150,
                talla: 'M',
                color: 'Negro',
                stock: 5,
                usuario: 'user123'
            };

            req.body = {
                nombre: 'Casco',
                categoria: 'Cascos',
                precio: 150,
                talla: 'M',
                color: 'Negro',
                stock: 5
            };

            Product.create.mockResolvedValue(mockProduct);

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        it('debe devolver error 400 si faltan campos requeridos', async () => {
            req.body = {
                nombre: 'Casco',
                categoria: 'Cascos'
            };

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Todos los campos son requeridos')
                })
            );
        });

        it('debe crear producto con stock por defecto en 0', async () => {
            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco',
                categoria: 'Cascos',
                precio: 150,
                talla: 'M',
                color: 'Negro',
                stock: 0,
                usuario: 'user123'
            };

            req.body = {
                nombre: 'Casco',
                categoria: 'Cascos',
                precio: 150,
                talla: 'M',
                color: 'Negro'
            };

            Product.create.mockResolvedValue(mockProduct);

            await createProduct(req, res);

            expect(Product.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    stock: 0,
                    usuario: 'user123'
                })
            );
        });
    });

    describe('updateProduct', () => {
        it('debe actualizar un producto exitosamente', async () => {
            const mockProduct = {
                _id: 'product123',
                nombre: 'Casco Actualizado',
                categoria: 'Cascos',
                precio: 180,
                talla: 'L',
                color: 'Azul',
                stock: 10
            };

            req.params.id = 'product123';
            req.body = {
                nombre: 'Casco Actualizado',
                precio: 180,
                talla: 'L',
                color: 'Azul'
            };

            Product.findByIdAndUpdate.mockResolvedValue(mockProduct);

            await updateProduct(req, res);

            expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
                'product123',
                req.body,
                { new: true, runValidators: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            req.params.id = 'nonexistent';
            req.body = { nombre: 'Nuevo nombre' };

            Product.findByIdAndUpdate.mockResolvedValue(null);

            await updateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Producto no encontrado'
            });
        });

        it('debe manejar errores al actualizar un producto', async () => {
            req.params.id = 'product123';
            req.body = { nombre: 'Nuevo' };

            Product.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));

            await updateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Error actualizando producto'
                })
            );
        });
    });

    describe('deleteProduct', () => {
        it('debe eliminar un producto exitosamente', async () => {
            req.params.id = 'product123';

            Product.findById.mockResolvedValue({
                usuario: 'user123',
                deleteOne: jest.fn().mockResolvedValue({})
            });

            await deleteProduct(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: 'Producto eliminado correctamente'
            });
        });

        it('debe devolver error 404 si el producto no existe', async () => {
            req.params.id = 'nonexistent';

            Product.findById.mockResolvedValue(null);

            await deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Producto no encontrado'
            });
        });

        it('debe devolver error 403 si el usuario no es propietario', async () => {
            req.params.id = 'product123';
            req.user._id = 'differentUser';

            Product.findById.mockResolvedValue({
                usuario: 'user123',
                deleteOne: jest.fn()
            });

            await deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'No autorizado'
            });
        });

        it('debe manejar errores al eliminar un producto', async () => {
            req.params.id = 'product123';

            Product.findById.mockRejectedValue(new Error('DB Error'));

            await deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Error eliminando producto'
                })
            );
        });
    });
});
