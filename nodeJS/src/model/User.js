const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    address: { type: String, required: true },
    point: Number,
}, {timestamps: true})

const User = mongoose.model('user', UserSchema)
module.exports = {User}