import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const products = response.data.data.products;

        // Get featured products (first 4 products with highest rating)
        const featured = products
          .sort((a, b) => b.customerReviewCount - a.customerReviewCount)
          .slice(0, 4);
        setFeaturedProducts(featured);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all">
            View All Products →
          </Link>
        </div>
        <div className="featured-products">
          {featuredProducts.map((product) => (
            <div key={product._id} className="featured-product-card">
              <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.shipping === "Free shipping" && (
                    <span className="free-shipping-badge">Free Shipping</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                 
        
                  <div className="price-rating">
                    <span className="price">${product.salePrice}</span>
                    <span className="rating">
                      ⭐ {product.customerReviewCount} Reviews
                    </span>
                  </div>
                  <button className="view-details-btn">View Details</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>About Us</h2>
          <p>
            Welcome to our e-commerce store! We are dedicated to providing you
            with the best shopping experience possible. Our mission is to offer
            high-quality products at unbeatable prices while delivering
            exceptional customer service.
          </p>
          <p>
            From electronics to fashion, home essentials to beauty products, we
            have everything you need in one place. We carefully curate our
            product selection to ensure our customers get the best value for
            their money.
          </p>
          <p>
            At our core, we value trust, transparency, and customer
            satisfaction. We are committed to making your shopping journey
            seamless and enjoyable. Thank you for choosing us as your trusted
            shopping destination!
          </p>
          <Link to="/about" className="learn-more-btn">
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-truck"></i>
            <h3>Fast Delivery</h3>
            <p>Free shipping on orders over $50</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Secure Payment</h3>
            <p>100% secure payment</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-headset"></i>
            <h3>24/7 Support</h3>
            <p>Dedicated support</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-undo"></i>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
