import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetailsPage from "./pages/OrderDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import ContactUsPage from "./pages/ContactUsPage";
import ShippingPolicy from './pages/ShippingPolicy';
import Returns from './pages/Returns';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs"
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetailsView from "./pages/ProductDetailsView";

function App() {
  return (
   <AuthProvider>
     <Router>
      <Navbar />
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListing />} />
        {/* <Route path="/product/:id" element={<ProductDetails />} /> */}
        <Route path="/product/:id" element={<ProductDetailsView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
       
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
       
        <Route path="/about" element={<AboutUs />}/>
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />
      </Router>
   </AuthProvider>
  );
}

export default App;
