const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { mockProducts } = require('../mock-data');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// @route   GET /api/products
// @desc    Obtener todos los productos del usuario (DEMO MODE)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const products = mockProducts.filter(p => p.usuario === req.userId).sort((a, b) => b.createdAt - a.createdAt);
        res.json(products);
    } catch (err) {
        console.error('Error obteniendo productos:', err);
        res.status(500).json({ message: 'Error obteniendo productos' });
    }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto específico (DEMO MODE)
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const product = mockProducts.find(p => p._id === req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar que el producto pertenece al usuario
        if (product.usuario !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para acceder a este producto' });
        }

        res.json(product);
    } catch (err) {
        console.error('Error obteniendo producto:', err);
        res.status(500).json({ message: 'Error obteniendo producto' });
    }
});

// @route   POST /api/products
// @desc    Crear nuevo producto (DEMO MODE)
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, talla, color, stock } = req.body;

        // Validar entrada
        if (!nombre || !categoria || !precio) {
            return res.status(400).json({ message: 'Nombre, categoría y precio son requeridos' });
        }

        const newProduct = {
            _id: Date.now().toString(),
            nombre,
            descripcion: descripcion || '',
            categoria,
            precio,
            talla: talla || 'N/A',
            color: color || '',
            stock: stock || 0,
            usuario: req.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockProducts.push(newProduct);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creando producto:', err);
        res.status(500).json({ message: 'Error creando producto' });
    }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto (DEMO MODE)
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let product = mockProducts.find(p => p._id === req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar que el producto pertenece al usuario
        if (product.usuario !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para editar este producto' });
        }

        // Actualizar campos
        const { nombre, descripcion, categoria, precio, talla, color, stock } = req.body;

        if (nombre) product.nombre = nombre;
        if (descripcion !== undefined) product.descripcion = descripcion;
        if (categoria) product.categoria = categoria;
        if (precio !== undefined) product.precio = precio;
        if (talla) product.talla = talla;
        if (color !== undefined) product.color = color;
        if (stock !== undefined) product.stock = stock;
        product.updatedAt = new Date();

        res.json(product);
    } catch (err) {
        console.error('Error actualizando producto:', err);
        res.status(500).json({ message: 'Error actualizando producto' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto (DEMO MODE)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const product = mockProducts.find(p => p._id === req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar que el producto pertenece al usuario
        if (product.usuario !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
        }

        const index = mockProducts.indexOf(product);
        mockProducts.splice(index, 1);
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error('Error eliminando producto:', err);
        res.status(500).json({ message: 'Error eliminando producto' });
    }
});

module.exports = router;
