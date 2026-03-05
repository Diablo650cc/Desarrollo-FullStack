const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getPool } = require('../db');

function mapProduct(row) {
    return {
        _id: String(row.id),
        nombre: row.nombre,
        descripcion: row.descripcion || '',
        categoria: row.categoria,
        precio: Number(row.precio),
        talla: row.talla || '',
        color: row.color || '',
        stock: Number(row.stock),
        usuario: String(row.usuario_id),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

// @route   GET /api/products
// @desc    Obtener todos los productos del usuario
// @access  Private
router.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');

        res.json(rows.map(mapProduct));
    } catch (err) {
        console.error('Error obteniendo productos:', err);
        res.status(500).json({ message: 'Error obteniendo productos' });
    }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto específico
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const product = rows[0];

        // Verificar que el producto pertenece al usuario
        if (String(product.usuario_id) !== String(req.userId)) {
            return res.status(403).json({ message: 'No tienes permiso para acceder a este producto' });
        }

        res.json(mapProduct(product));
    } catch (err) {
        console.error('Error obteniendo producto:', err);
        res.status(500).json({ message: 'Error obteniendo producto' });
    }
});

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, talla, color, stock } = req.body;
        const pool = getPool();

        // Validar entrada
        if (!nombre || !categoria || !precio) {
            return res.status(400).json({ message: 'Nombre, categoría y precio son requeridos' });
        }

        const [insertResult] = await pool.query(
            `INSERT INTO products (nombre, descripcion, categoria, precio, talla, color, stock, usuario_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                descripcion || '',
                categoria,
                precio,
                talla || '',
                color || '',
                stock || 0,
                req.userId
            ]
        );

        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            insertResult.insertId
        ]);

        res.status(201).json(mapProduct(rows[0]));
    } catch (err) {
        console.error('Error creando producto:', err);
        res.status(500).json({ message: 'Error creando producto' });
    }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const pool = getPool();
        const [existingRows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (existingRows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const existingProduct = existingRows[0];
        if (String(existingProduct.usuario_id) !== String(req.userId)) {
            return res.status(403).json({ message: 'No tienes permiso para editar este producto' });
        }

        const { nombre, descripcion, categoria, precio, talla, color, stock } = req.body;

        await pool.query(
            `UPDATE products
             SET nombre = ?, descripcion = ?, categoria = ?, precio = ?, talla = ?, color = ?, stock = ?
             WHERE id = ?`,
            [
                nombre ?? existingProduct.nombre,
                descripcion ?? existingProduct.descripcion,
                categoria ?? existingProduct.categoria,
                precio ?? existingProduct.precio,
                talla ?? existingProduct.talla,
                color ?? existingProduct.color,
                stock ?? existingProduct.stock,
                req.params.id
            ]
        );

        const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        res.json(mapProduct(updatedRows[0]));
    } catch (err) {
        console.error('Error actualizando producto:', err);
        res.status(500).json({ message: 'Error actualizando producto' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const product = rows[0];

        // Verificar que el producto pertenece al usuario
        if (String(product.usuario_id) !== String(req.userId)) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
        }

        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error('Error eliminando producto:', err);
        res.status(500).json({ message: 'Error eliminando producto' });
    }
});

module.exports = router;
