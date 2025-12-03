const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');

// Create customer
router.post('/', customerController.createCustomer);

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get single customer + orders
router.get('/:customerId', customerController.getCustomer);

module.exports = router;
