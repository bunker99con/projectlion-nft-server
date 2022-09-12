const mongoose = require('mongoose');

const Qr_productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    qr_id: String,
    process: String,
    point: Number,
    qr_check: Boolean,
}, {timestamps: true})

const Qr_product = mongoose.model('Qr_product', Qr_productSchema)
module.exports = {Qr_product}