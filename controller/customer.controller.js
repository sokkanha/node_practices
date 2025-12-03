const Customer = require('../models/customer.model');
const bcrypt = require('bcrypt');

/**
 * crate customer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        const exists = await Customer.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await Customer.create({
            firstName,
            lastName,
            email,
            phone,
            address,
            password: hashedPassword
        });

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 ** Get all customers
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * * Get customer with order
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId).populate('orders');
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
