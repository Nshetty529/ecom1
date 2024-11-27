const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    bestSellingRank: { type: Number, required: false },
    thumbnailImage: { type: String, required: false },
    salePrice: { type: Number, required: true },
    manufacturer: { type: String, required: false },
    url: { type: String, required: false },
    type: { type: String, required: true },
    image: { type: String, required: false },
    customerReviewCount: { type: Number, required: false },
    shipping: { type: String, required: false },
    salePrice_range: { type: String, required: false },
    objectID: { type: String, required: true, unique: true, default: function () { return this._id.toString(); } },
    categories: [{ type: String, required: false }],
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
