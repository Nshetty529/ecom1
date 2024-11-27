import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const ProductDetailsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

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
                { productId: product._id, quantity },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-toast';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Added to cart successfully!
            `;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                successMessage.remove();
            }, 3000);

        } catch (err) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-toast';
            errorMessage.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                Failed to add to cart
            `;
            document.body.appendChild(errorMessage);

            setTimeout(() => {
                errorMessage.remove();
            }, 3000);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="details-loading">
                <div className="loader"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="details-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{error || 'Product not found'}</p>
                <button onClick={() => navigate('/')}>Back to Products</button>
            </div>
        );
    }

    return (
        <div className="product-details-view">
            <div className="details-container">
                <div className="details-left">
                    <div className="product-image-container">
                        <img src={product.image} alt={product.name} />
                        {product.shipping === "Free shipping" && (
                            <span className="shipping-badge">
                                <i className="fas fa-truck"></i> Free Shipping
                            </span>
                        )}
                    </div>
                </div>

                <div className="details-right">
                    <h1 className="product-title">{product.name}</h1>
                    
                    {product.manufacturer && (
                        <div className="manufacturer-info">
                            <span>Brand:</span> {product.manufacturer}
                        </div>
                    )}

                    <div className="product-meta">
                        <div className="price-container">
                            <span className="price-label">Price:</span>
                            <span className="price-amount">${product.salePrice}</span>
                        </div>
                        
                        {product.customerReviewCount > 0 && (
                            <div className="reviews-info">
                                <i className="fas fa-star"></i>
                                <span>{product.customerReviewCount} Reviews</span>
                            </div>
                        )}
                    </div>

                    <div className="product-description">
                        <h3>Product Description</h3>
                        <p>{product.shortDescription}</p>
                    </div>

                    {product.categories && product.categories.length > 0 && (
                        <div className="product-categories">
                            <h3>Categories</h3>
                            <div className="category-list">
                                {product.categories.map((category, index) => (
                                    <span key={index} className="category-tag">
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="purchase-section">
                        <div className="quantity-control">
                            <label>Quantity:</label>
                            <div className="quantity-buttons">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <span>{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <button 
                            className={`add-to-cart-button ${addingToCart ? 'loading' : ''}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                        >
                            {addingToCart ? (
                                <>
                                    <div className="button-spinner"></div>
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
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsView;
