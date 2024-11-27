import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/orders/${orderId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setOrder(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details');
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, token]);

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div>
            <p>Loading order details...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <Link to="/orders" className="back-button">Go to Orders</Link>
        </div>
    );

    if (!order) return (
        <div className="error-container">
            <i className="fas fa-exclamation-circle"></i>
            <p>Order not found</p>
            <Link to="/orders" className="back-button">Go to Orders</Link>
        </div>
    );

    return (
        <div className="order-confirmation-container">
            <div className="confirmation-header">
                <div className="success-checkmark">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h1>Order Confirmed!</h1>
                <p className="order-number">Order #{orderId.slice(-6)}</p>
                <p className="thank-you">Thank you for your purchase!</p>
            </div>

            <div className="confirmation-content">
                <div className="order-details-section">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="products-list">
                            {order.products.map((item) => (
                                <div key={item._id} className="product-item">
                                    <div className="product-info">
                                        <img 
                                            src={item.product.image || 'placeholder.jpg'} 
                                            alt={item.product.name}
                                        />
                                        <div className="product-details">
                                            <h3>{item.product.name}</h3>
                                            <p className="quantity">Quantity: {item.quantity}</p>
                                            <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-totals">
                            <div className="subtotal">
                                <span>Subtotal</span>
                                <span>${(order.totalPrice - 10).toFixed(2)}</span>
                            </div>
                            <div className="shipping">
                                <span>Shipping</span>
                                <span>$10.00</span>
                            </div>
                            <div className="total">
                                <span>Total</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="shipping-details">
                        <h2>Shipping Details</h2>
                        <div className="address-info">
                            <p className="name">{order.shippingAddress.fullName}</p>
                            <p className="address">{order.shippingAddress.address}</p>
                            <p className="city-state">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p className="country">{order.shippingAddress.country}</p>
                            <p className="phone">Phone: {order.shippingAddress.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <Link to="/orders" className="view-orders-btn">
                        <i className="fas fa-list-ul"></i>
                        View All Orders
                    </Link>
                    <Link to="/" className="continue-shopping-btn">
                        <i className="fas fa-shopping-cart"></i>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
