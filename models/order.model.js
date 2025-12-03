const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }, // optional, to track batch/warehouse
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // snapshot price at order time
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Pending" 
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    paymentMethod: { type: String }, // e.g. "Credit Card", "PayPal", "COD"
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
