import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const Checkout = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cart, setCart] = useState(null);
    
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCart(response.data);
            } catch (err) {
                setError('Failed to fetch cart');
            }
        };
        fetchCart();
    }, [token]);

    const calculateTotal = () => {
        if (!cart || !cart.products) return 0;
        return cart.products.reduce((total, item) => {
            return total + (item.product.salePrice * item.quantity);
        }, 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const cleanCart = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/cart/clean',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            console.error('Error cleaning cart:', error);
        }
    };
    
    // Update handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            console.log('Submitting order with data:', {
                shippingAddress,
                token
            });
    
            const response = await axios.post(
                'http://localhost:5000/api/orders',
                { shippingAddress },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log('Order response:', response.data);
            navigate(`/order-confirmation/${response.data._id}`);
        } catch (err) {
            console.error('Full error:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };
    
    

    if (!cart) return <div className="loading">Loading...</div>;

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            {error && <div className="error-message">{error}</div>}
            
            <div className="checkout-content">
                <div className="shipping-form">
                    <h2>Shipping Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={shippingAddress.fullName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Street Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your street address"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={shippingAddress.state}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={shippingAddress.postalCode}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter postal code"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={shippingAddress.country}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={shippingAddress.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter phone number"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="place-order-btn"
                            disabled={loading || cart.products.length === 0}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-content">
                        {cart.products.map((item) => (
                            <div key={item.product._id} className="summary-item">
                                <div className="item-info">
                                    <span className="item-name">{item.product.name}</span>
                                    <span className="item-quantity">Qty: {item.quantity}</span>
                                </div>
                                <span className="item-price">
                                    ${(item.product.salePrice * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>$10.00</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${(calculateTotal() + 10).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
