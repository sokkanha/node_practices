const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');

router.get('/', productController.getAllProduct);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProductById);

module.exports = router;