import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetailsPage = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });

        setOrder(response.data); // Set order details in state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err.message);
        setError("Failed to load order details. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-details-page">
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>

      <h2>Shipping Address</h2>
      <p>{order.shippingAddress.address}</p>
      <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
      <p>{order.shippingAddress.country}</p>

      <h2>Order Items</h2>
      <ul>
        {order.orderItems.map((item) => (
          <li key={item.product}>
            <p><strong>Product:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ${item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailsPage;
