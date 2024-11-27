import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'processing':
                return 'status-processing';
            case 'shipped':
                return 'status-shipped';
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div>
            <p>Loading your orders...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="order-history-container">
            <h1>Order History</h1>
            
            {orders.length === 0 ? (
                <div className="no-orders">
                    <i className="fas fa-shopping-bag"></i>
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/" className="start-shopping-btn">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-basic-info">
                                    <h2>Order #{order._id.slice(-6)}</h2>
                                    <p className="order-date">
                                        <i className="far fa-calendar-alt"></i>
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <span className={`order-status ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-content">
                                <div className="products-section">
                                    <h3>Products</h3>
                                    <div className="order-products">
                                        {order.products.map((item) => (
                                            <div key={item._id} className="order-product-item">
                                                <img 
                                                    src={item.product.image || 'placeholder.jpg'} 
                                                    alt={item.product.name}
                                                />
                                                <div className="product-details">
                                                    <h4>{item.product.name}</h4>
                                                    <p className="quantity">Quantity: {item.quantity}</p>
                                                    <p className="price">
                                                        Price: ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-details">
                                    <div className="shipping-info">
                                        <h3>Shipping Details</h3>
                                        <p className="recipient">
                                            <i className="fas fa-user"></i>
                                            {order.shippingAddress.fullName}
                                        </p>
                                        <p className="address">
                                            <i className="fas fa-map-marker-alt"></i>
                                            {order.shippingAddress.address}
                                        </p>
                                        <p className="location">
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                        </p>
                                        <p className="country">{order.shippingAddress.country}</p>
                                        <p className="phone">
                                            <i className="fas fa-phone"></i>
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>

                                    <div className="price-summary">
                                        <h3>Order Summary</h3>
                                        <div className="price-details">
                                            <div className="price-row">
                                                <span>Subtotal</span>
                                                <span>${(order.totalPrice - 10).toFixed(2)}</span>
                                            </div>
                                            <div className="price-row">
                                                <span>Shipping</span>
                                                <span>$10.00</span>
                                            </div>
                                            <div className="price-row total">
                                                <span>Total</span>
                                                <span>${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-actions">
                                <Link 
                                    to={`/order-confirmation/${order._id}`} 
                                    className="view-details-btn"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
