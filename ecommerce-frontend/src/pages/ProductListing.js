import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext for token

const ProductListing = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success/error messages

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [shipping, setShipping] = useState("");
  const [categories, setCategories] = useState([]);

  const { token } = useAuth(); // Get the token from AuthContext

  // Fetch Products with Filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          ...(search && { search }),
          ...(selectedCategory && { category: selectedCategory }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
          ...(shipping && { shipping }),
        });

        const response = await axios.get(
          `http://localhost:5000/api/products?${queryParams}`
        );

        setProducts(response.data.data.products);
        setTotalPages(response.data.data.totalPages);

        // Extract unique categories if not already loaded
        if (categories.length === 0) {
          const uniqueCategories = [
            ...new Set(
              response.data.data.products.flatMap((product) => product.categories)
            ),
          ];
          setCategories(uniqueCategories);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, search, selectedCategory, priceRange, shipping]);

  // Pagination Logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisibleButtons = 5;
    const halfRange = Math.floor(maxVisibleButtons / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Handle Filter Changes
  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Reset Filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setShipping("");
    setCurrentPage(1);
  };

  // Handle Add to Cart
  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Product added to cart successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data?.message || error.message);
      setMessage("Failed to add product to cart.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-listing-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="product-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <h3>Filters</h3>

          {/* Category Filter */}
          <div className="filter-section">
            <h4>Categories</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange("min", e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange("max", e.target.value)}
              />
            </div>
          </div>

          {/* Shipping Filter */}
          <div className="filter-section">
            <h4>Shipping</h4>
            <select value={shipping} onChange={(e) => setShipping(e.target.value)}>
              <option value="">All</option>
              <option value="free">Free Shipping</option>
              <option value="paid">Paid Shipping</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          {message && <p className="message">{message}</p>}
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">No products found</div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="price">${product.salePrice}</p>
                  {product.shipping === "Free shipping" && (
                    <span className="free-shipping">Free Shipping</span>
                  )}
                  <Link to={`/product/${product._id}`} className="view-details">
                    View Details
                  </Link>
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={currentPage === number ? "active" : ""}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
