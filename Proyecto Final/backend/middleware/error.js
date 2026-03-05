class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

function notFoundHandler(req, res, next) {
    next(new AppError('Ruta no encontrada', 404));
}

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
}

module.exports = {
    AppError,
    notFoundHandler,
    errorHandler
};
