const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"}
}, {
    timestamps: true
});

// encrypt password 
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// compare password from req and exits password
userSchema.method('validatePassword', async function (password) {
    return await bcrypt.compare(password, this.password);
});

module.exports = mongoose.model('Users', userSchema);