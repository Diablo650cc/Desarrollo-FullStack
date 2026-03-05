const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getPool } = require('../db');
const { AppError } = require('../middleware/error');
const {
    validate,
    validatePaginationQuery,
    validateProductPayload,
    validateProductUpdatePayload,
    validateStatusPatch
} = require('../middleware/validate');

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
        status: row.status,
        usuario: String(row.usuario_id),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function buildProductsWhereClause(query, user) {
    const conditions = [];
    const params = [];

    if (user.role !== 'admin') {
        conditions.push('usuario_id = ?');
        params.push(user.id);
    }

    if (query.categoria) {
        conditions.push('categoria = ?');
        params.push(query.categoria);
    }

    if (query.status) {
        conditions.push('status = ?');
        params.push(query.status);
    }

    if (query.search) {
        conditions.push('(nombre LIKE ? OR descripcion LIKE ?)');
        params.push(`%${query.search}%`, `%${query.search}%`);
    }

    if (query.minPrice !== undefined) {
        conditions.push('precio >= ?');
        params.push(Number(query.minPrice));
    }

    if (query.maxPrice !== undefined) {
        conditions.push('precio <= ?');
        params.push(Number(query.maxPrice));
    }

    if (conditions.length === 0) {
        return { whereClause: '', params };
    }

    return { whereClause: `WHERE ${conditions.join(' AND ')}`, params };
}

router.use(authMiddleware);

// @route   GET /api/products
// @desc    Obtener todos los productos del usuario
// @access  Private
router.get('/', validate(validatePaginationQuery), async (req, res, next) => {
    try {
        const pool = getPool();
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const offset = (page - 1) * limit;

        const { whereClause, params } = buildProductsWhereClause(req.query, req.user);

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM products ${whereClause}`,
            params
        );

        const [rows] = await pool.query(
            `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const total = Number(countRows[0]?.total || 0);

        res.json({
            data: rows.map(mapProduct),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1
            },
            filters: {
                categoria: req.query.categoria || null,
                status: req.query.status || null,
                search: req.query.search || null,
                minPrice: req.query.minPrice || null,
                maxPrice: req.query.maxPrice || null
            }
        });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto específico
// @access  Private
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (rows.length === 0) {
            return next(new AppError('Producto no encontrado', 404));
        }

        const product = rows[0];

        if (req.user.role !== 'admin' && String(product.usuario_id) !== String(req.user.id)) {
            return next(new AppError('No tienes permiso para acceder a este producto', 403));
        }

        res.json(mapProduct(product));
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private
router.post('/', validate(validateProductPayload), async (req, res, next) => {
    try {
        const { nombre, descripcion, categoria, precio, talla, color, stock, status } = req.body;
        const pool = getPool();

        const [insertResult] = await pool.query(
            `INSERT INTO products (nombre, descripcion, categoria, precio, talla, color, stock, status, usuario_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                descripcion || '',
                categoria,
                precio,
                talla || '',
                color || '',
                stock || 0,
                status || 'active',
                req.user.id
            ]
        );

        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            insertResult.insertId
        ]);

        res.status(201).json(mapProduct(rows[0]));
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private
router.put('/:id', validate(validateProductUpdatePayload), async (req, res, next) => {
    try {
        const pool = getPool();
        const [existingRows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (existingRows.length === 0) {
            return next(new AppError('Producto no encontrado', 404));
        }

        const existingProduct = existingRows[0];
        if (req.user.role !== 'admin' && String(existingProduct.usuario_id) !== String(req.user.id)) {
            return next(new AppError('No tienes permiso para editar este producto', 403));
        }

        const { nombre, descripcion, categoria, precio, talla, color, stock, status } = req.body;

        await pool.query(
            `UPDATE products
             SET nombre = ?, descripcion = ?, categoria = ?, precio = ?, talla = ?, color = ?, stock = ?, status = ?
             WHERE id = ?`,
            [
                nombre ?? existingProduct.nombre,
                descripcion ?? existingProduct.descripcion,
                categoria ?? existingProduct.categoria,
                precio ?? existingProduct.precio,
                talla ?? existingProduct.talla,
                color ?? existingProduct.color,
                stock ?? existingProduct.stock,
                status ?? existingProduct.status,
                req.params.id
            ]
        );

        const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        res.json(mapProduct(updatedRows[0]));
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
// @access  Private
router.delete('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (rows.length === 0) {
            return next(new AppError('Producto no encontrado', 404));
        }

        const product = rows[0];

        if (req.user.role !== 'admin' && String(product.usuario_id) !== String(req.user.id)) {
            return next(new AppError('No tienes permiso para eliminar este producto', 403));
        }

        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        next(err);
    }
});

router.patch('/:id/status', validate(validateStatusPatch), async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        if (rows.length === 0) {
            return next(new AppError('Producto no encontrado', 404));
        }

        const product = rows[0];
        if (req.user.role !== 'admin' && String(product.usuario_id) !== String(req.user.id)) {
            return next(new AppError('No tienes permiso para cambiar estado de este producto', 403));
        }

        await pool.query('UPDATE products SET status = ? WHERE id = ?', [req.body.status, req.params.id]);

        const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
            req.params.id
        ]);

        res.json(mapProduct(updatedRows[0]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
