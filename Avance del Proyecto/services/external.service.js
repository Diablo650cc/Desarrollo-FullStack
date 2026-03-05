const axios = require('axios');

/**
 * Obtener precio actual del dólar desde API externa
 */
async function obtenerPrecioDolar() {
  try {
    // Usando API pública de tipos de cambio
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 5000
    });

    return {
      exito: true,
      usd: response.data.rates.USD,
      ars: response.data.rates.ARS,
      mxn: response.data.rates.MXN,
      fechaActualizacion: new Date(),
      fuente: 'exchangerate-api.com'
    };
  } catch (error) {
    console.error('Error al obtener precio del dólar:', error.message);
    return {
      exito: false,
      mensaje: 'Error al obtener el precio del dólar',
      error: error.message
    };
  }
}

/**
 * Procesar pago con Stripe (en modo test)
 */
async function procesarPagoStripe(token, monto, descripcion) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

    // En producción esto sería con un token real de Stripe
    const pago = await stripe.paymentIntents.create({
      amount: Math.round(monto * 100), // Stripe usa centavos
      currency: 'usd',
      description: descripcion,
      payment_method: token,
      confirm: true
    });

    return {
      exito: true,
      idPago: pago.id,
      estado: pago.status,
      monto: monto,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error en pago Stripe:', error.message);
    return {
      exito: false,
      mensaje: 'Error al procesar el pago',
      error: error.message
    };
  }
}

/**
 * Procesar pago simulado (para desarrollo)
 */
async function procesarPagoSimulado(monto, descripcion, usuarioId) {
  try {
    // Simular procesamiento de pago
    const idPago = `PAY_${Date.now()}_${usuarioId}`;
    
    // En una aplicación real, aquí guardarías el pago en la BD
    return {
      exito: true,
      idPago: idPago,
      estado: 'completado',
      monto: monto,
      descripcion: descripcion,
      usuarioId: usuarioId,
      timestamp: new Date(),
      modo: 'simulado'
    };
  } catch (error) {
    console.error('Error en pago simulado:', error.message);
    return {
      exito: false,
      mensaje: 'Error al procesar el pago',
      error: error.message
    };
  }
}

/**
 * Validar monto de pago
 */
function validarMontoPago(monto) {
  if (typeof monto !== 'number' || monto <= 0) {
    return { valido: false, mensaje: 'El monto debe ser un número positivo' };
  }
  if (monto < 0.50) {
    return { valido: false, mensaje: 'El monto mínimo es 0.50' };
  }
  if (monto > 10000) {
    return { valido: false, mensaje: 'El monto máximo es 10000' };
  }
  return { valido: true };
}

module.exports = {
  obtenerPrecioDolar,
  procesarPagoStripe,
  procesarPagoSimulado,
  validarMontoPago
};
