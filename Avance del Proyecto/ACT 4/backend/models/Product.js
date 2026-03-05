const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Cascos', 'Guantes', 'Chaquetas', 'Botas', 'Accesorios', 'Motos']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    talla: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Actualizar fecha de modificación antes de guardar
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Actualizar fecha de modificación antes de actualizar
productSchema.pre('findByIdAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Product', productSchema);
