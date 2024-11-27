import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [message, setMessage] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setAddingToCart(true);
            await axios.post(
                'http://localhost:5000/api/cart/add',
                { 
                    productId: product._id, 
                    quantity 
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setMessage('Product added to cart successfully!');
            
            // Show success message with animation
            const messageElement = document.createElement('div');
            messageElement.className = 'floating-message success';
            messageElement.textContent = 'Added to cart!';
            document.body.appendChild(messageElement);
            
            setTimeout(() => {
                messageElement.remove();
            }, 3000);

        } catch (err) {
            setError('Failed to add product to cart');
            setTimeout(() => setError(''), 3000);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div>
            <p>Loading product details...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p>{error}</p>
        </div>
    );

    if (!product) return (
        <div className="error-container">
            <p>Product not found</p>
        </div>
    );

    return (
        <div className="product-detail-container">
            <div className="product-detail-content">
                <div className="product-image-section">
                    <div className="main-image-container">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="main-image"
                        />
                        {product.shipping === "Free shipping" && (
                            <span className="free-shipping-badge">
                                <i className="fas fa-truck"></i> Free Shipping
                            </span>
                        )}
                    </div>
                </div>

                <div className="product-info-section">
                    <div className="product-header">
                        <h1>{product.name}</h1>
                        {product.manufacturer && (
                            <p className="manufacturer">
                                <span>Brand:</span> {product.manufacturer}
                            </p>
                        )}
                    </div>

                    <div className="product-pricing">
                        <div className="price-tag">
                            <span className="price">${product.salePrice}</span>
                            {product.customerReviewCount > 0 && (
                                <div className="review-badge">
                                    <i className="fas fa-star"></i>
                                    <span>{product.customerReviewCount} Reviews</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="product-description">
                        <h2>About this item</h2>
                        <p>{product.shortDescription}</p>
                    </div>

                    <div className="purchase-options">
                        <div className="quantity-selector">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
                                >
                                    -
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button 
                            className={`add-to-cart-btn ${addingToCart ? 'loading' : ''}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                        >
                            {addingToCart ? (
                                <>
                                    <span className="spinner"></span>
                                    Adding to Cart...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-shopping-cart"></i>
                                    Add to Cart
                                </>
                            )}
                        </button>
                    </div>

                    {product.categories && product.categories.length > 0 && (
                        <div className="product-categories">
                            <h2>Categories</h2>
                            <div className="category-tags">
                                {product.categories.map((category, index) => (
                                    <span key={index} className="category-tag">
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
