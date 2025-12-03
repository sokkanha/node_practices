const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    password: { type: String, required: true }, // hashed
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
