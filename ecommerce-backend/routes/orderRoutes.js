// const express = require('express');
// const { placeOrder, getUserOrders,getOrderDetails } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware');
// const router = express.Router();

// // POST /api/orders - Place an order
// router.post('/', protect, placeOrder);

// // GET /api/orders - Get all orders for the logged-in user
// router.get('/', protect, getUserOrders);

// // GET /api/orders/:id - Get details of a specific order
// router.get('/:id', protect, getOrderDetails);
// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    placeOrder, 
    getUserOrders, 
    getOrderById 
} = require('../controllers/orderController');

// Place order
router.post('/', protect, placeOrder);

// Get user's orders
router.get('/', protect, getUserOrders);

// Get single order
router.get('/:id', protect, getOrderById);

module.exports = router;
