const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true, default: 0},
    imgUrl: [{type: String}],
    shortDescription: { type: String, trim: true },  
    fullDescription: { type: String },
    category: { type: String },
    brand: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);