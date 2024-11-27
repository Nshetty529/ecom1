const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ensure this field is `userId`
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Product reference
      quantity: { type: Number, default: 1 }, // Default quantity is 1
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
