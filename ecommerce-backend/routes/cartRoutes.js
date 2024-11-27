const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart ,
    cleanCart
} = require("../controllers/cartController");

// Get cart
router.get("/", protect, getCart);

// Add to cart
router.post("/add", protect, addToCart);

// Update cart item
router.put("/:id", protect, updateCartItem);
router.post('/clean', protect, cleanCart);

// Remove from cart
router.delete("/:id", protect, removeFromCart);

module.exports = router;
