const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authorization.middleware');
const { obtenerPrecioDolar } = require('../services/external.service');

/**
 * GET /api/external/dolar - Obtener precio actual del dólar
 * Endpoint público (sin autenticación requerida)
 */
router.get('/dolar', async (req, res) => {
  try {
    const resultado = await obtenerPrecioDolar();

    if (!resultado.exito) {
      return res.status(500).json({
        message: resultado.mensaje,
        error: resultado.error
      });
    }

    res.json({
      message: 'Precio del dólar obtenido correctamente',
      data: {
        usd: resultado.usd,
        ars: resultado.ars,
        mxn: resultado.mxn,
        tasas: {
          usdToArs: resultado.ars,
          usdToMxn: resultado.mxn
        },
        actualizadoEn: resultado.fechaActualizacion,
        fuente: resultado.fuente
      }
    });
  } catch (error) {
    console.error('Error en endpoint de dólar:', error);
    res.status(500).json({ message: 'Error al obtener precio del dólar' });
  }
});

/**
 * GET /api/external/dolar/convertir - Convertir cantidad de USD a otra moneda
 * Query params: ?cantidad=100&towards=ARS
 */
router.get('/dolar/convertir', async (req, res) => {
  try {
    const { cantidad, towards } = req.query;

    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    if (!towards) {
      return res.status(400).json({ message: 'Moneda destino requerida (towards)' });
    }

    const resultado = await obtenerPrecioDolar();

    if (!resultado.exito) {
      return res.status(500).json({
        message: resultado.mensaje,
        error: resultado.error
      });
    }

    let tasa = 1;
    let moneda = 'USD';

    if (towards.toUpperCase() === 'ARS') {
      tasa = resultado.ars;
      moneda = 'ARS';
    } else if (towards.toUpperCase() === 'MXN') {
      tasa = resultado.mxn;
      moneda = 'MXN';
    } else {
      return res.status(400).json({
        message: 'Moneda no soportada',
        monedasDisponibles: ['ARS', 'MXN']
      });
    }

    const cantidadConvertida = parseFloat(cantidad) * tasa;

    res.json({
      message: 'Conversión realizada correctamente',
      data: {
        original: {
          cantidad: parseFloat(cantidad),
          moneda: 'USD'
        },
        convertido: {
          cantidad: cantidadConvertida.toFixed(2),
          moneda: moneda
        },
        tasa: tasa.toFixed(2),
        actualizadoEn: resultado.fechaActualizacion
      }
    });
  } catch (error) {
    console.error('Error en conversión de dólar:', error);
    res.status(500).json({ message: 'Error al realizar conversión' });
  }
});

/**
 * GET /api/external/health - Verificar estado de APIs externas
 * Solo para admins
 */
router.get('/health', authMiddleware, async (req, res) => {
  try {
    const resultado = await obtenerPrecioDolar();

    res.json({
      message: 'Estado de APIs externas',
      apis: {
        exchangeRate: {
          estado: resultado.exito ? 'operativo' : 'error',
          ultimaActualizacion: resultado.exito ? resultado.fechaActualizacion : null,
          error: resultado.exito ? null : resultado.error
        },
        stripe: {
          estado: process.env.STRIPE_SECRET_KEY ? 'configurado' : 'no configurado',
          modo: process.env.STRIPE_MODE || 'test'
        }
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error al verificar APIs externas:', error);
    res.status(500).json({ message: 'Error al verificar estado' });
  }
});

module.exports = router;
