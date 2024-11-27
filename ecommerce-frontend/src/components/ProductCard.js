import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Price: ${product.salePrice}</p>
      <Link to={`/product/${product._id}`} className="view-details">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
