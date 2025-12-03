const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventory.controller');

// Create inventory for a product
router.post('/', inventoryController.createInventory);

// Get all inventory
router.get('/', inventoryController.getAllInventory);

// Get inventory by product ID
router.get('/:productId', inventoryController.getInventoryByProduct);

// Update stock (increase or decrease)
router.patch('/:productId/stock', inventoryController.updateStock);

// Update or add warehouse stock
router.patch('/:productId/warehouse', inventoryController.updateWarehouseStock);

// Add a batch
router.post('/:productId/batch', inventoryController.addBatch);

// Delete inventory for a product
router.delete('/:productId', inventoryController.deleteInventory);

module.exports = router;
