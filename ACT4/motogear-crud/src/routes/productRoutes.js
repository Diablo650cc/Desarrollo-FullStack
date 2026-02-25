const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, checkProductOwner } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas
router.post('/', protect, createProduct);
router.put('/:id', protect, checkProductOwner, updateProduct);
router.delete('/:id', protect, checkProductOwner, deleteProduct);

module.exports = router;