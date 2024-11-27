const express = require('express');
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// IMPORTANT: Order matters! Put the base route first
// router.get('/', getProducts);                    // Get all products (must come before /:id)
// router.get('/:id', getProductById);              // Get single product


// Add console log to main route
router.get('/', (req, res, next) => {
    console.log("GET /api/products route hit");
    next();
  }, getProducts);
  
// router.get('/', getProducts); // Route for all products
router.get('/:id', getProductById); // Route for a single product
router.post('/', protect, createProduct);        // Create product
router.put('/:id', protect, updateProduct);      // Update product
router.delete('/:id', protect, deleteProduct);   // Delete product

module.exports = router;
