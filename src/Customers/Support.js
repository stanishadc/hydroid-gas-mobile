import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import MobileFooter from "../Common/Layouts/MobileFooter";
import NewsMarquee from "../Customers/NewsMarquee";
import ValveComponent from "../Customers/ValveComponent";
import NewTicket from "../Pages/NewTicket";
import CustomerDistributer from "../Customers/CustomerDistributer";
import "./MobileSupport.css";

export default function Support() {
  return (
    <div className="mobile-support-container">
      {/* Mobile Header */}
      <div className="mobile-support-header">
        <h4>Support</h4>
      </div>

      {/* Content Area */}
      <div className="mobile-support-content">
        {/* News Marquee */}
        <div className="mobile-news-marquee">
          <NewsMarquee />
        </div>

        {/* Distributer and Valve Components */}
        <div className="mobile-components-row">
          <CustomerDistributer />
          <ValveComponent />
        </div>

        {/* Ticket Component */}
        <NewTicket />
      </div>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  );
}
