const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },

    // Total stock count for this product (all warehouses/batches)
    totalQuantity: {
        type: Number,
        require: true,
        default: 0
    },

    // If you want multi-warehouse support
    warehouses: [
        {
            location: { type: String }, // e.g. "Hanoi Warehouse", "HCM Warehouse"
            quantity: { type: Number, default: 0 }
        }
    ],

    // Optional batch tracking (useful for electronics with manufacturing dates)
    batches: [
        {
            batchId: { type: String },
            quantity: { type: Number, default: 0 },
            manufactureDate: { type: Date },
            expiryDate: { type: Date }
        }
    ],

    lowStockThreshold: {
        type: Number,
        default: 5
    },

    status: {
        type: String,
        enum: ["In Stock", "Low Stock", "Out of Stock"],
        default: "In Stock"
    }
}, {
    timestamps: true
});

// auto update status base on quantity
inventorySchema.pre('save', function(next) {
    if (this.totalQuantity <=0){
        this.status = "Out of Stock";
    } else if (this.totalQuantity <= this.lowStockThreshold) {
        this.status = "Low Stock";
    } else {
        this.status = "In stock";
    }
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);