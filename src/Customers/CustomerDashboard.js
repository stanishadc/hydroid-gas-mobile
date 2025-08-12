import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import NewsMarquee from "./NewsMarquee";
import CustomerNotifications from "./CustomerNotifications";
import ConsumerDetails from "./ConsumerDetails";
import moment from "moment";
import { handleSuccess } from "../Common/Layouts/CustomAlerts";
import MobileFooter from "../Common/Layouts/MobileFooter";
import "./MobileCustomerDashboard.css";

export default function CustomerDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const getBalanceCardColor = () => {
    if (dashboardData?.gasAvailable <= 0) {
      return "bg-danger";
    } else if (dashboardData?.gasAvailable <= 2) {
      return "bg-warning";
    } else {
      return "bg-success";
    }
  };

  const handlRefresh = (e) => {
    e.preventDefault();
    setRefresh(true);
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETDEVICEBALANCE +
          "?EndDeviceId=" +
          dashboardData.endDeviceId,
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setTimeout(() => {
            handleSuccess(response.data.message);
            GetUserData();
            setRefresh(false);
          }, 5000);
        }
      });
  };

  const GetUserData = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETDEVICEBYUSER +
          "?UserId=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setDashboardData(response.data.data);
        }
      });
  };

  useEffect(() => {
    GetUserData();
  }, []);

  return (
    <div className="mobile-dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-dashboard-header">
        <h4>Dashboard</h4>
      </div>

      {/* Content Area */}
      <div className="mobile-dashboard-content">
        {/* News Marquee */}
        <div className="mobile-news-marquee">
          <NewsMarquee />
        </div>

        {/* Dashboard Cards */}
        <div className="mobile-cards-container">
          {/* LPG Balance Card */}
          <div className={`mobile-dashboard-card ${getBalanceCardColor()}`}>
            <div className="card-header">
              <h5>LPG Balance</h5>
            </div>
            <div className="card-body">
              <h2>{dashboardData?.gasAvailable} Kgs</h2>
              {dashboardData?.gasLastUpdated === "0001-01-01T00:00:00" ? (
                ""
              ) : (
                <p>
                  Last Updated:{" "}
                  {moment
                    .utc(dashboardData?.gasLastUpdated)
                    .local()
                    .format("DD MMM YYYY hh:mm a")}
                </p>
              )}
              <div className="card-actions">
                {refresh === false ? (
                  <button
                    className="btn btn-sm btn-light"
                    onClick={handlRefresh}
                  >
                    Update Balance
                  </button>
                ) : (
                  <button className="btn btn-sm btn-light" disabled>
                    Updating...
                  </button>
                )}
                {dashboardData?.gasAvailable <= 0 ? (
                  <Link to="/recharge" className="btn btn-sm btn-light">
                    No Balance.. Recharge Now
                  </Link>
                ) : dashboardData?.gasAvailable <= 2 ? (
                  <Link to="/recharge" className="btn btn-sm btn-light">
                    Low Balance.. Recharge Now
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Consumption Cards - Side by Side */}
          <div className="consumption-cards-row">
            {/* Today's Consumption Card */}
            <div className="mobile-dashboard-card bg-primary">
              <div className="card-header">
                <h5> Consumption</h5>
              </div>
              <div className="card-body">
                <h2>{`${
                  dashboardData?.consumption === null
                    ? 0
                    : dashboardData?.consumption
                } kgs`}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Consumer Details and Notifications */}
        <div className="mobile-sections-container">
          <ConsumerDetails />
          <CustomerNotifications />
        </div>
      </div>

      {/* Mobile Footer Navigation */}
      <MobileFooter />
    </div>
  );
}
