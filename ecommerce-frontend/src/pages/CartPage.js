import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  // Fetch cart data
  const fetchCart = async () => {
    try {
      
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart Data:", response.data); // Debug log
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      setMessage("Error loading cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleCheckout = () => {
    navigate('/checkout');
};

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
      setMessage("Quantity updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setMessage("Failed to update quantity.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
      setMessage("Product removed from cart!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error removing item:", error);
      setMessage("Failed to remove item from cart.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Calculate total price with proper number conversion
  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((total, item) => {
      const price = parseFloat(item.product.salePrice) || 0; // Use salePrice instead of price
      const quantity = parseInt(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  };

  // Helper function to format price
  const formatPrice = (price) => {
    const number = parseFloat(price);
    return isNaN(number) ? "0.00" : number.toFixed(2);
  };

  if (!cart) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {message && <div className="message">{message}</div>}
      <div className="cart-items">
        {!cart.products || cart.products.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty!</p>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {cart.products.map((item) => {
              // Skip rendering if the product is null
              if (!item.product) {
                console.warn("Skipping null product in cart:", item); // Debugging log
                return null;
              }

              return (
                <div key={item.product._id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={
                        item.product.image || "https://via.placeholder.com/150"
                      } // Use placeholder image if missing
                      alt={item.product.name || "Unnamed Product"} // Use fallback name if missing
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.product.name}</h3>
                    <p className="price">
                      Price: ${formatPrice(item.product.salePrice)}
                    </p>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="subtotal">
                      Subtotal: $
                      {formatPrice(item.product.salePrice * item.quantity)}
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="cart-summary">
              <div className="total">
                <h3>Total: ${formatPrice(calculateTotal())}</h3>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
