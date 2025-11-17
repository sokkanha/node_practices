const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true, default: 0},
    imgUrl: [{type: String}],
    // Short info
    shortDescription: { type: String, trim: true },     // show under product card
    fullDescription: { type: String },
    // Category (simple but enough for phone & laptop shop)
    category: {
        type: String,
        required: true,
        enum: [
            'Smartphone',
            'Laptop',
            'Tablet',
            'Accessories',
            'Smart Watch',
            'Earphones',
            'Power Bank',
            'Case & Protector',
            'Charger & Cable'
        ]
    },
    brand: {
        type: String,
        required: true,
        enum: ['Apple', 'Samsung', 'OPPO', 'Vivo', 'Xiaomi', 'Realme', 'Huawei', 'Asus', 'Lenovo', 'Acer', 'MSI', 'Dell', 'HP', 'Other']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);