const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');

/**
 ** Create inventory
 */
exports.createInventory = async(req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const inventory = await Inventory.create(req.body);
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

/**
 ** Get all inventory
 */
exports.getAllInventory = async(req, res) => {
    try {
        const inventory  = await Inventory.find().populate('inventory Id');
         res.json(inventory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


/**
 ** Get inventory by product
 */
exports.getInventoryByProduct = async(req, res) => {
    try {
        const {productId} = req.body;
        const inventory = await Inventory.findOne({productId}).populate('productId');
        
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found for this product" });
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({error: error.message});
    } 
};


/**
 ** Update total stock
 */
exports.updateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { amount } = req.body; // positive or negative

        const inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        inventory.totalQuantity += amount;

        if (inventory.totalQuantity < 0) inventory.totalQuantity = 0;

        await inventory.save();

        res.json({ message: "Stock updated", inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 ** Add or update a warehouse stock
 */
exports.updateWarehouseStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { location, quantity } = req.body;

        const inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        const warehouse = inventory.warehouses.find(w => w.location === location);

        if (warehouse) {
            warehouse.quantity = quantity; // update
        } else {
            inventory.warehouses.push({ location, quantity }); // add new
        }

        // recalculate total
        inventory.totalQuantity = inventory.warehouses.reduce((sum, w) => sum + w.quantity, 0);

        await inventory.save();

        res.json({ message: "Warehouse updated", inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 ** Add a batch
 */
exports.addBatch = async (req, res) => {
    try {
        const { productId } = req.params;
        const { batchId, quantity, manufactureDate, expiryDate } = req.body;

        const inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        inventory.batches.push({
            batchId,
            quantity,
            manufactureDate,
            expiryDate
        });

        inventory.totalQuantity += quantity;

        await inventory.save();

        res.json({ message: "Batch added", inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 ** Delete inventory record
 */
exports.deleteInventory = async (req, res) => {
    try {
        const { productId } = req.params;

        const deleted = await Inventory.findOneAndDelete({ productId });

        if (!deleted) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        res.json({ message: "Inventory deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};