// const Product = require('../models/Product');
// const Cart = require('../models/Cart');
// const Order = require('../models/Order');

// // Fetch all products
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Fetch a single product by ID
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findOne({ objectID: req.params.id });
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Add a new product (Admin only)
// const createProduct = async (req, res) => {
//   const {
//     name,
//     shortDescription,
//     bestSellingRank,
//     thumbnailImage,
//     salePrice,
//     manufacturer,
//     url,
//     type,
//     image,
//     customerReviewCount,
//     shipping,
//     salePrice_range,
//     objectID,
//     categories,
//   } = req.body;

//   try {
//     const newProduct = await Product.create({
//       name,
//       shortDescription,
//       bestSellingRank,
//       thumbnailImage,
//       salePrice,
//       manufacturer,
//       url,
//       type,
//       image,
//       customerReviewCount,
//       shipping,
//       salePrice_range,
//       objectID,
//       categories,
//     });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update an existing product (Admin only)
// const updateProduct = async (req, res) => {
//   try {
//     const updatedProduct = await Product.findOneAndUpdate(
//       { objectID: req.params.id },
//       req.body,
//       { new: true }
//     );
//     if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a product (Admin only)
// const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findOneAndDelete({ objectID: req.params.id });
//     if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Place an order
// const placeOrder = async (req, res) => {
//   try {
//       // Find the user's cart
//       const cart = await Cart.findOne({ userId: req.user._id }).populate("products.product");

//       if (!cart || cart.products.length === 0) {
//           return res.status(400).json({ message: "Cart is empty" });
//       }

//       // Calculate total price
//       const totalPrice = cart.products.reduce((total, item) => {
//           return total + (item.product.salePrice * item.quantity);
//       }, 0);

//       // Create new order
//       const order = new Order({
//           user: req.user._id,
//           products: cart.products.map(item => ({
//               product: item.product._id,
//               quantity: item.quantity,
//               price: item.product.salePrice
//           })),
//           totalPrice,
//           shippingAddress: req.body.shippingAddress,
//           status: "Pending"
//       });

//       await order.save();

//       // Clear the cart
//       cart.products = [];
//       await cart.save();

//       res.status(201).json(order);
//   } catch (error) {
//       console.error("Order placement error:", error);
//       res.status(500).json({ message: "Failed to place order" });
//   }
// };

// // Get user's orders
// const getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id }).populate("products.product");
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error.message);
//     res.status(500).json({ message: "Failed to fetch orders." });
//   }
// };

// // Get order details
// const getOrderDetails = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("products.product");

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     if (order.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to view this order' });
//     }

//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Error fetching order details:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Admin: Get all orders
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("products.product")
//       .populate("user", "name email");
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching all orders:", error.message);
//     res.status(500).json({ message: "Failed to fetch all orders." });
//   }
// };

// // Admin: Update order status
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found." });
//     }

//     order.status = status;
//     await order.save();

//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Error updating order status:", error.message);
//     res.status(500).json({ message: "Failed to update order status." });
//   }
// };
// module.exports = {
//     getProducts,
//     getProductById,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//     placeOrder,
//     getUserOrders,
//     getOrderDetails,
//     getAllOrders,
//     updateOrderStatus,
//   };
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Place Order



const placeOrder = async (req, res) => {
    try {
        // 1. Log the incoming request
        console.log('Request Body:', req.body);
        console.log('User:', req.user);

        // 2. Find and verify cart
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
        console.log('Found Cart:', JSON.stringify(cart, null, 2));

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 3. Filter valid products and log them
        const validProducts = cart.products.filter(item => {
            console.log('Checking product:', item);
            return item.product && item.product.salePrice;
        });
        console.log('Valid Products:', validProducts);

        if (validProducts.length === 0) {
            return res.status(400).json({ message: "No valid products in cart" });
        }

        // 4. Calculate total with logging
        let subtotal = 0;
        validProducts.forEach(item => {
            const price = Number(item.product.salePrice);
            const quantity = Number(item.quantity);
            const itemTotal = price * quantity;
            console.log(`Item: ${item.product.name}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`);
            subtotal += itemTotal;
        });

        const shippingCost = 10;
        const totalPrice = subtotal + shippingCost;
        console.log('Subtotal:', subtotal);
        console.log('Shipping Cost:', shippingCost);
        console.log('Total Price:', totalPrice);

        // 5. Create order data
        const orderData = {
            user: req.user._id,
            products: validProducts.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: Number(item.product.salePrice)
            })),
            shippingAddress: req.body.shippingAddress,
            totalPrice,
            status: 'Pending'
        };
        console.log('Order Data:', JSON.stringify(orderData, null, 2));

        // 6. Save order
        const order = new Order(orderData);
        const savedOrder = await order.save();
        console.log('Saved Order:', savedOrder);

        // 7. Clear cart
        cart.products = [];
        await cart.save();
        console.log('Cart cleared');

        // 8. Send response
        res.status(201).json(savedOrder);

    } catch (error) {
        console.error('Detailed Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            message: "Failed to place order",
            error: error.message,
            details: error.stack
        });
    }
};



// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product')
            .sort('-createdAt');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// Get single order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('products.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ensure user can only access their own orders
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch order" });
    }
};




// // Get user's orders
// const getUserOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user._id })
//             .populate('products.product')
//             .sort('-createdAt');
//         res.status(200).json(orders);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch orders" });
//     }
// };

// // Get single order
// const getOrderById = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id)
//             .populate('products.product')
//             .populate('user', 'name email');

//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         // Ensure user can only access their own orders (unless admin)
//         if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         res.status(200).json(order);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch order" });
//     }
// };

module.exports = {
    placeOrder,
    getUserOrders,
    getOrderById
};
