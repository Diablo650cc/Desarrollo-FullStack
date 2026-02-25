const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Cascos', 'Chaquetas', 'Guantes', 'Botas', 'Accesorios']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    talla: {
        type: String,
        required: [true, 'La talla es requerida']
    },
    color: {
        type: String,
        required: [true, 'El color es requerido']
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);