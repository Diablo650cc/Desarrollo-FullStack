const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authMiddleware } = require('../middleware/auth');
const { getPool } = require('../db');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const pool = getPool();
        let rows;

        try {
            [rows] = await pool.query(
                'SELECT id, email, created_at FROM users ORDER BY id ASC'
            );
        } catch (error) {
            // Compatibilidad con esquemas legacy que no tienen created_at.
            if (error?.code !== 'ER_BAD_FIELD_ERROR') {
                throw error;
            }

            [rows] = await pool.query('SELECT id, email FROM users ORDER BY id ASC');
        }

        const users = rows.map((row) => ({
            id: String(row.id),
            email: row.email,
            createdAt: row.created_at || null
        }));

        res.json(users);
    } catch (error) {
        console.error('Error listando usuarios:', error);
        res.status(500).json({ message: 'Error listando usuarios' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        const userId = req.params.id;
        const pool = getPool();

        if (!email && !password) {
            return res.status(400).json({ message: 'Debes enviar email o password para actualizar' });
        }

        const [users] = await pool.query('SELECT id, email, password FROM users WHERE id = ? LIMIT 1', [
            userId
        ]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const existingUser = users[0];
        const nextEmail = email ?? existingUser.email;
        let nextPassword = existingUser.password;

        if (email) {
            const [duplicated] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1',
                [email, userId]
            );
            if (duplicated.length > 0) {
                return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
            }
        }

        if (password) {
            nextPassword = await bcrypt.hash(password, 10);
        }

        await pool.query('UPDATE users SET email = ?, password = ? WHERE id = ?', [
            nextEmail,
            nextPassword,
            userId
        ]);

        const [updatedRows] = await pool.query(
            'SELECT id, email, created_at FROM users WHERE id = ? LIMIT 1',
            [userId]
        );

        const updatedUser = updatedRows[0];
        res.json({
            id: String(updatedUser.id),
            email: updatedUser.email,
            createdAt: updatedUser.created_at
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ message: 'Error actualizando usuario' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const pool = getPool();

        if (String(req.userId) === String(userId)) {
            return res.status(400).json({ message: 'No puedes eliminar tu propio usuario en sesión' });
        }

        const [users] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ message: 'Error eliminando usuario' });
    }
});

module.exports = router;
