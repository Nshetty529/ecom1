import React from 'react';

const Returns = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Returns & Exchanges</h1>

        <section className="policy-section">
          <h2>Return Policy</h2>
          <p>We accept returns within 30 days of purchase. Items must be:</p>
          <ul>
            <li>Unused and in original condition</li>
            <li>In original packaging</li>
            <li>With all tags attached</li>
            <li>Accompanied by the original receipt</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>How to Return</h2>
          <ol>
            <li>Login to your account and initiate a return</li>
            <li>Print the provided return shipping label</li>
            <li>Package your item securely</li>
            <li>Drop off at any authorized shipping location</li>
          </ol>
        </section>

        <section className="policy-section">
          <h2>Refund Process</h2>
          <p>Once we receive your return:</p>
          <ul>
            <li>We'll inspect the item within 2 business days</li>
            <li>Refund will be processed to original payment method</li>
            <li>You'll receive a confirmation email</li>
            <li>Funds typically appear in 3-5 business days</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Exchanges</h2>
          <p>For exchanges:</p>
          <ul>
            <li>Follow the same return process</li>
            <li>Indicate you want an exchange</li>
            <li>Select the new item you want</li>
            <li>We'll ship the new item once we receive your return</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Returns;
