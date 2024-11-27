const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add to Cart Controller
const addToCart = async (req, res) => {
    console.log("Add to Cart Request Body:", req.body);
    console.log("User from Middleware:", req.user);
  
    const { productId, quantity } = req.body;
  
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        console.log("Cart found in DB:", cart);
  
        if (!cart) {
            cart = new Cart({ userId: req.user._id, products: [] });
            console.log("Created new cart for user:", req.user._id);
        }
  
        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );
  
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
            console.log("Updated product quantity in cart:", cart.products[productIndex]);
        } else {
            cart.products.push({ product: productId, quantity });
            console.log("Added new product to cart:", { productId, quantity });
        }
  
        await cart.save();
        
        // Populate the product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate('products.product');
        console.log("Cart saved successfully:", populatedCart);
  
        res.status(200).json(populatedCart);
    } catch (error) {
        console.error("Add to Cart error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get Cart Controller
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove products with null references
    cart.products = cart.products.filter((item) => item.product !== null);

    res.status(200).json(cart);
  } catch (error) {
    console.error("Get Cart error:", error.message);
    res.status(500).json({ message: "Failed to fetch cart." });
  }
};


// Update Cart Item Controller
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
  
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        console.log("Cart found:", cart);
  
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
  
        console.log("Product ID from request:", req.params.id);
        console.log("Products in cart:", cart.products);
  
        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === req.params.id
        );
  
        if (productIndex === -1) {
            console.log("Product not found in cart.");
            return res.status(404).json({ message: "Product not found in cart" });
        }
  
        cart.products[productIndex].quantity = quantity;
        console.log("Updated product quantity:", cart.products[productIndex]);
  
        await cart.save();
        
        // Populate the product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate('products.product');
        res.status(200).json(populatedCart);
    } catch (error) {
        console.error("Update Cart Item error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Remove from Cart Controller
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        console.log("Cart found for removal:", cart);
  
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
  
        const updatedProducts = cart.products.filter(
            (item) => item.product.toString() !== req.params.id
        );
  
        if (updatedProducts.length === cart.products.length) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
  
        cart.products = updatedProducts;
        console.log("Product removed from cart:", req.params.id);
  
        await cart.save();
        
        // Populate the product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate('products.product');
        res.status(200).json(populatedCart);
    } catch (error) {
        console.error("Remove from Cart error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
// Clean cart (remove null products)
const cleanCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out null products
        cart.products = cart.products.filter(item => item.product != null);
        await cart.save();

        // Populate product details
        const updatedCart = await Cart.findById(cart._id).populate('products.product');
        
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Failed to clean cart" });
    }
};


// Export all controllers in a single statement
module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    cleanCart
};
