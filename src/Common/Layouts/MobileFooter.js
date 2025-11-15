import React from "react";
import { Link } from "react-router-dom";
import "../Layouts/MobileFooter.css";

export default function MobileFooter() {
  return (
    <div className="mobile-footer-nav">
      <Link to="/customer/dashboard" className="footer-nav-item">
        <i className="ri-home-4-line"></i>
        <span>Home</span>
      </Link>
      <Link to="/recharge" className="footer-nav-item">
        <i className="ri-wallet-3-line"></i>
        <span>Recharge</span>
      </Link>
      <Link to="/support" className="footer-nav-item">
        <i className="ri-customer-service-2-line"></i>
        <span>Support</span>
      </Link>
      <Link to="/mobileprofile" className="footer-nav-item">
        <i className="ri-user-3-line"></i>
        <span>Profile</span>
      </Link>
    </div>
  );
}
