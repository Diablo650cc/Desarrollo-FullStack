const Product = require('../models/Product');

// @desc    Obtener todos los productos
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('usuario', 'email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo productos', error: error.message });
    }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('usuario', 'email');
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo producto', error: error.message });
    }
};

// @desc    Crear un producto
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const { nombre, categoria, precio, talla, color, stock } = req.body;

        // Validar campos requeridos
        if (!nombre || !categoria || !precio || !talla || !color) {
            return res.status(400).json({ 
                message: 'Todos los campos son requeridos: nombre, categoria, precio, talla, color' 
            });
        }

        const product = await Product.create({
            nombre,
            categoria,
            precio,
            talla,
            color,
            stock: stock || 0,
            usuario: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creando producto', error: error.message });
    }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar propiedad (ya lo hace el middleware, pero por seguridad)
        if (product.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando producto', error: error.message });
    }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar propiedad
        if (product.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        await product.deleteOne();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando producto', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};