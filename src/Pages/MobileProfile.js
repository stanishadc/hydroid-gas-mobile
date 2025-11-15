import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MobileFooter from "../Common/Layouts/MobileFooter";
import "./MobileProfile.css";

export default function MobileProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h4>Profile</h4>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-card">
          {/* Profile Picture and Basic Info */}
          <div className="profile-info">
            <div className="profile-avatar">
              <i className="ri-user-3-fill"></i>
            </div>
            <h5 className="profile-name">
              {localStorage.getItem("name") || "User"}
            </h5>
            <p className="profile-role">
              {localStorage.getItem("roleName") || "Customer"}
            </p>
          </div>

          {/* Profile Links */}
          <div className="profile-links">
            <Link
              to="/profile"
              className={`profile-link ${
                activeTab === "profile" ? "active" : ""
              }`}
            >
              <i className="ri-account-circle-line" />
              <span>Profile</span>
            </Link>

            <Link to="/changepassword" className="profile-link">
              <i className="ri-lock-line" />
              <span>Change Password</span>
            </Link>

            <div onClick={handleLogout} className="profile-logout">
              <i className="ri-logout-box-r-line" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <MobileFooter />
    </div>
  );
}
