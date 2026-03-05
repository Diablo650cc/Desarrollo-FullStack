const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { getPool } = require('../db');
const { AppError } = require('../middleware/error');
const { validate, validateUserUpdate } = require('../middleware/validate');

router.use(authMiddleware);
router.use(authorizeRoles('admin'));

router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const offset = (page - 1) * limit;

        const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM users');
        const [rows] = await pool.query(
            'SELECT id, email, role, created_at FROM users ORDER BY id ASC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const users = rows.map((row) => ({
            id: String(row.id),
            email: row.email,
            role: row.role,
            createdAt: row.created_at || null
        }));

        res.json({
            data: users,
            pagination: {
                page,
                limit,
                total: Number(countRows[0]?.total || 0),
                totalPages: Math.ceil(Number(countRows[0]?.total || 0) / limit) || 1
            }
        });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validate(validateUserUpdate), async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const userId = req.params.id;
        const pool = getPool();

        const [users] = await pool.query('SELECT id, email, password, role, created_at FROM users WHERE id = ? LIMIT 1', [
            userId
        ]);

        if (users.length === 0) {
            return next(new AppError('Usuario no encontrado', 404));
        }

        const existingUser = users[0];
        const nextEmail = email ?? existingUser.email;
        const nextRole = role ?? existingUser.role;
        let nextPassword = existingUser.password;

        if (email) {
            const [duplicated] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1',
                [email, userId]
            );
            if (duplicated.length > 0) {
                return next(new AppError('El email ya esta en uso por otro usuario', 400));
            }
        }

        if (password) {
            nextPassword = await bcrypt.hash(password, 10);
        }

        await pool.query('UPDATE users SET email = ?, password = ?, role = ? WHERE id = ?', [
            nextEmail,
            nextPassword,
            nextRole,
            userId
        ]);

        const [updatedRows] = await pool.query(
            'SELECT id, email, role, created_at FROM users WHERE id = ? LIMIT 1',
            [userId]
        );

        const updatedUser = updatedRows[0];
        res.json({
            id: String(updatedUser.id),
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.created_at
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const pool = getPool();

        if (String(req.user.id) === String(userId)) {
            return next(new AppError('No puedes eliminar tu propio usuario en sesion', 400));
        }

        const [users] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
        if (users.length === 0) {
            return next(new AppError('Usuario no encontrado', 404));
        }

        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
