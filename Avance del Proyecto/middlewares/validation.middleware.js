const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
}

/**
 * Validadores para relacionados con usuarios
 */
const usuarioValidators = {
  registro: [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('email')
      .isString().withMessage('El email debe ser un texto'),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ],

  login: [
    body('email')
      .isString().withMessage('El email debe ser un texto'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria'),
    handleValidationErrors
  ],

  actualizarUsuario: [
    body('nombre')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('email')
      .optional()
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('rol')
      .optional()
      .isIn(['usuario', 'admin']).withMessage('El rol debe ser "usuario" o "admin"'),
    handleValidationErrors
  ],

  crearUsuario: [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('email')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe incluir mayúsculas, minúsculas y números'),
    body('rol')
      .optional()
      .isIn(['usuario', 'admin']).withMessage('El rol debe ser "usuario" o "admin"'),
    handleValidationErrors
  ],

  paginacion: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 }).withMessage('La búsqueda no puede estar vacía'),
    handleValidationErrors
  ],

  idParam: [
    param('id')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número válido'),
    handleValidationErrors
  ]
};

/**
 * Validadores para pagos
 */
const pagoValidators = {
  crearPago: [
    body('monto')
      .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),
    body('moneda')
      .isIn(['USD', 'ARS', 'MXN']).withMessage('Moneda inválida'),
    body('descripcion')
      .trim()
      .notEmpty().withMessage('La descripción es obligatoria')
      .isLength({ max: 255 }).withMessage('La descripción no puede exceder 255 caracteres'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  usuarioValidators,
  pagoValidators
};
