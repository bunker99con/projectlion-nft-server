const mongoose = require('mongoose');

const Qr_historySchema = new mongoose.Schema({
    userId: String,
    address: String,
    product_name : String,
    qr_product_id: String,
    point: Number,
    qr_id : String,
}, {timestamps: true})

const Qr_history = mongoose.model('Qr_history', Qr_history)
module.exports = {Qr_history}