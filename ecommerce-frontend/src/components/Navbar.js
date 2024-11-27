import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Admin Navigation
  const AdminNav = () => (
    <div className="navbar-links">
      <Link to="/admin" className="nav-link">
        <i className="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </Link>
      <Link to="/admin/products" className="nav-link">
        <i className="fas fa-box"></i>
        <span>Products</span>
      </Link>
      <Link to="/admin/orders" className="nav-link">
        <i className="fas fa-shopping-bag"></i>
        <span>Orders</span>
      </Link>
      <Link to="/admin/users" className="nav-link">
        <i className="fas fa-users"></i>
        <span>Users</span>
      </Link>
      <div className="nav-dropdown">
        <button className="nav-dropdown-btn">
          <i className="fas fa-user-shield"></i>
          <span>{user?.name || "Admin"}</span>
        </button>
        <div className="nav-dropdown-content">
          <Link to="/admin/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );

  // User Navigation
  const UserNav = () => (
    <div className="navbar-links">
      <Link to="/" className="nav-link">
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>
      <Link to="/products" className="nav-link">
        <i className="fas fa-store"></i>
        <span>Products</span>
      </Link>
      <Link to="/cart" className="nav-link">
        <i className="fas fa-shopping-cart"></i>
        <span>Cart</span>
      </Link>
      <Link to="/orders" className="nav-link">
        <i className="fas fa-box"></i>
        <span>My Orders</span>
      </Link>
      <div className="nav-dropdown">
        <button className="nav-dropdown-btn">
          <i className="fas fa-user"></i>
          <span>{user?.name || "Account"}</span>
        </button>
        <div className="nav-dropdown-content">
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );

  // Guest Navigation
  const GuestNav = () => (
    <div className="navbar-links">
      <Link to="/" className="nav-link">
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>
      <Link to="/products" className="nav-link">
        <i className="fas fa-store"></i>
        <span>Products</span>
      </Link>
      <Link to="/login" className="nav-link">
        <i className="fas fa-sign-in-alt"></i>
        <span>Login</span>
      </Link>
      <Link to="/register" className="nav-link register-link">
        <i className="fas fa-user-plus"></i>
        <span>Register</span>
      </Link>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAdmin ? "/admin" : "/"} className="navbar-logo">
          <i className="fas fa-shopping-bag"></i>
          <span>{isAdmin ? "Admin Dashboard" : "E-Commerce"}</span>
        </Link>
        {isLoggedIn ? (isAdmin ? <AdminNav /> : <UserNav />) : <GuestNav />}
      </div>
    </nav>
  );
};

export default Navbar;
