const { Double } = require('bson');
const mongoose = require('mongoose');

const Nft_listSchema = new mongoose.Schema({
    address: String,
    name: String,
    price: String,
}, {timestamps: true})

const Nft_list = mongoose.model('nft_list', Nft_listSchema)
module.exports = {Nft_list}