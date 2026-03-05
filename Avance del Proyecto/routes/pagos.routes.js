const express = require('express');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middlewares/authorization.middleware');
const { pagoValidators } = require('../middlewares/validation.middleware');
const { procesarPagoSimulado, validarMontoPago } = require('../services/external.service');
const pool = require('../config/db');

/**
 * POST /api/pagos/procesar - Procesar un pago
 * Solo usuarios autenticados
 */
router.post('/procesar', authMiddleware, pagoValidators.crearPago, async (req, res) => {
  const { monto, moneda, descripcion } = req.body;
  const usuarioId = req.usuario.id;

  try {
    // Validar monto
    const validacion = validarMontoPago(monto);
    if (!validacion.valido) {
      return res.status(400).json({ message: validacion.mensaje });
    }

    // Procesar pago (simulado por ahora)
    const resultadoPago = await procesarPagoSimulado(monto, descripcion, usuarioId);

    if (!resultadoPago.exito) {
      return res.status(400).json({ message: resultadoPago.mensaje });
    }

    // Guardar registro de pago en BD
    try {
      const [result] = await pool.query(
        'INSERT INTO pagos (usuario_id, monto, moneda, descripcion, id_transaccion, estado) VALUES (?, ?, ?, ?, ?, ?)',
        [usuarioId, monto, moneda, descripcion, resultadoPago.idPago, 'completado']
      );

      res.status(201).json({
        message: 'Pago procesado exitosamente',
        pago: {
          id: result.insertId,
          idTransaccion: resultadoPago.idPago,
          monto: monto,
          moneda: moneda,
          estado: 'completado',
          timestamp: resultadoPago.timestamp
        }
      });
    } catch (dbError) {
      console.error('Error al guardar pago en BD:', dbError);
      res.status(500).json({ message: 'Error al guardar registro de pago' });
    }
  } catch (error) {
    console.error('Error al procesar pago:', error);
    res.status(500).json({ message: 'Error al procesar el pago' });
  }
});

/**
 * GET /api/pagos - Obtener historial de pagos
 * Admin ve todos, usuarios ven solo los suyos
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, usuario_id, monto, moneda, descripcion, estado, created_at FROM pagos';
    let params = [];

    // Si no es admin, solo mostrar pagos propios
    const [usuarios] = await pool.query('SELECT rol FROM usuarios WHERE id = ?', [req.usuario.id]);
    if (usuarios[0].rol !== 'admin') {
      query += ' WHERE usuario_id = ?';
      params.push(req.usuario.id);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [pagos] = await pool.query(query, params);

    // Contar total de registros
    let countQuery = 'SELECT COUNT(*) as total FROM pagos';
    let countParams = [];
    if (usuarios[0].rol !== 'admin') {
      countQuery += ' WHERE usuario_id = ?';
      countParams.push(req.usuario.id);
    }
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      message: 'Pagos obtenidos correctamente',
      data: pagos,
      paginacion: {
        total: countResult[0].total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error al obtener pagos' });
  }
});

/**
 * GET /api/pagos/:id - Obtener detalles de un pago específico
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const [pagos] = await pool.query(
      'SELECT id, usuario_id, monto, moneda, descripcion, id_transaccion, estado, created_at FROM pagos WHERE id = ?',
      [id]
    );

    if (pagos.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    // Verificar permisos (solo el propietario o admin)
    const [usuarios] = await pool.query('SELECT rol FROM usuarios WHERE id = ?', [usuarioId]);
    if (usuarios[0].rol !== 'admin' && pagos[0].usuario_id !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para ver este pago' });
    }

    res.json({
      message: 'Pago obtenido correctamente',
      data: pagos[0]
    });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({ message: 'Error al obtener pago' });
  }
});

module.exports = router;
