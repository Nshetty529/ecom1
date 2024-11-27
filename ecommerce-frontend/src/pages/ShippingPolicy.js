import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Shipping Policy</h1>
        
        <section className="policy-section">
          <h2>Delivery Times</h2>
          <p>Standard shipping: 3-5 business days</p>
          <p>Express shipping: 1-2 business days</p>
          <p>International shipping: 7-14 business days</p>
        </section>

        <section className="policy-section">
          <h2>Shipping Costs</h2>
          <ul>
            <li>Orders over $50: FREE standard shipping</li>
            <li>Standard shipping: $5.99</li>
            <li>Express shipping: $12.99</li>
            <li>International shipping: Calculated at checkout</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Tracking Your Order</h2>
          <p>Once your order ships, you will receive a confirmation email with your tracking number. You can track your order status at any time by:</p>
          <ul>
            <li>Clicking the tracking link in your shipping confirmation email</li>
            <li>Logging into your account and viewing your order history</li>
            <li>Contacting our customer service team</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>International Shipping</h2>
          <p>We ship to most countries worldwide. Please note that international orders may be subject to:</p>
          <ul>
            <li>Import duties and taxes</li>
            <li>Customs clearance delays</li>
            <li>Additional delivery time</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
