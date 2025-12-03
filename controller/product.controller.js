const Product = require('../models/product.model');

exports.getAllProduct = async (req, res) => {
  try {
    const params = (({ productName, category, brand }) => ({ productName, category, brand }))(req.query);
    let filter = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && value.trim() !== "") {
        const cleaned = value.trim().replace(/^["']+|["']+$/g, "");
        
        // map query keys to db fields
        const fieldMap = {
          productName: "name",
          category: "category",
          brand: "brand"
        };

        filter[fieldMap[key]] = { $regex: cleaned, $options: "i" };
      }
    }

    const product = await Product.find(filter);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.createProduct = async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
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