const Product = require('../models/product.model');

exports.getAllProduct = async(req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (error) {
        res.status(500)({message: 'Server error'});
    }
};

exports.createProduct = async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (error) {
        res.status(500)({message: 'Server error'});
    }
}

exports.getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(400).json({message: 'Product not found'});
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteProductById = async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(400).json({message: 'Product not found'});
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateProduct = async(req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body);
        if(!product) return res.status(400).json({message: 'Product not found'});
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}