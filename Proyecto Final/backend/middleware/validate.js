const { AppError } = require('./error');

function validate(schemaFn) {
    return (req, res, next) => {
        const errors = schemaFn(req);
        if (errors.length > 0) {
            return next(new AppError(errors.join(' | '), 400));
        }
        return next();
    };
}

function validateAuthPayload(req) {
    const { email, password } = req.body;
    const errors = [];

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        errors.push('Email valido es requerido');
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
        errors.push('Password es requerida y debe tener al menos 4 caracteres');
    }

    return errors;
}

function validateProductPayload(req) {
    const { nombre, categoria, precio, stock } = req.body;
    const errors = [];

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
        errors.push('Nombre es requerido');
    }

    if (!categoria || typeof categoria !== 'string' || !categoria.trim()) {
        errors.push('Categoria es requerida');
    }

    if (precio === undefined || Number.isNaN(Number(precio)) || Number(precio) < 0) {
        errors.push('Precio debe ser un numero mayor o igual a 0');
    }

    if (stock !== undefined && (Number.isNaN(Number(stock)) || Number(stock) < 0)) {
        errors.push('Stock debe ser un numero mayor o igual a 0');
    }

    return errors;
}

function validateProductUpdatePayload(req) {
    const allowed = ['nombre', 'descripcion', 'categoria', 'precio', 'talla', 'color', 'stock', 'status'];
    const keys = Object.keys(req.body || {});
    const errors = [];

    if (keys.length === 0) {
        errors.push('Debes enviar al menos un campo para actualizar');
    }

    const invalidKey = keys.find((key) => !allowed.includes(key));
    if (invalidKey) {
        errors.push(`Campo no permitido: ${invalidKey}`);
    }

    if (req.body.precio !== undefined && (Number.isNaN(Number(req.body.precio)) || Number(req.body.precio) < 0)) {
        errors.push('Precio debe ser un numero mayor o igual a 0');
    }

    if (req.body.stock !== undefined && (Number.isNaN(Number(req.body.stock)) || Number(req.body.stock) < 0)) {
        errors.push('Stock debe ser un numero mayor o igual a 0');
    }

    if (req.body.status !== undefined && !['active', 'inactive'].includes(req.body.status)) {
        errors.push("Status debe ser 'active' o 'inactive'");
    }

    return errors;
}

function validateStatusPatch(req) {
    const { status } = req.body;
    const errors = [];

    if (!status || !['active', 'inactive'].includes(status)) {
        errors.push("Status debe ser 'active' o 'inactive'");
    }

    return errors;
}

function validatePaginationQuery(req) {
    const { page, limit, minPrice, maxPrice } = req.query;
    const errors = [];

    if (page !== undefined && (Number.isNaN(Number(page)) || Number(page) < 1)) {
        errors.push('Page debe ser un entero mayor o igual a 1');
    }

    if (limit !== undefined && (Number.isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        errors.push('Limit debe ser un entero entre 1 y 100');
    }

    if (minPrice !== undefined && (Number.isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
        errors.push('minPrice debe ser un numero mayor o igual a 0');
    }

    if (maxPrice !== undefined && (Number.isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
        errors.push('maxPrice debe ser un numero mayor o igual a 0');
    }

    if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        Number(minPrice) > Number(maxPrice)
    ) {
        errors.push('minPrice no puede ser mayor que maxPrice');
    }

    return errors;
}

function validateUserUpdate(req) {
    const { email, password, role } = req.body;
    const errors = [];

    if (!email && !password && !role) {
        errors.push('Debes enviar email, password o role');
    }

    if (email && (typeof email !== 'string' || !email.includes('@'))) {
        errors.push('Email no es valido');
    }

    if (password && (typeof password !== 'string' || password.length < 4)) {
        errors.push('Password debe tener al menos 4 caracteres');
    }

    if (role && !['admin', 'user'].includes(role)) {
        errors.push("Role debe ser 'admin' o 'user'");
    }

    return errors;
}

module.exports = {
    validate,
    validateAuthPayload,
    validatePaginationQuery,
    validateProductPayload,
    validateProductUpdatePayload,
    validateStatusPatch,
    validateUserUpdate
};
