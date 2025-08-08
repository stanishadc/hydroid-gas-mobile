import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import NewsMarquee from "./NewsMarquee"; // Import the new component
import CustomerNotifications from "./CustomerNotifications";
import ConsumerDetails from "./ConsumerDetails";
import moment from "moment";
import { handleSuccess } from "../Common/Layouts/CustomAlerts";

export default function CustomerDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  // Determine card color based on LPG balance
  const getBalanceCardColor = () => {
    if (dashboardData?.gasAvailable <= 0) {
      return "bg-danger"; // Red for 0 kg
    } else if (dashboardData?.gasAvailable <= 2) {
      return "bg-warning"; // Yellow for <= 2 kg
    } else {
      return "bg-success"; // Green for > 2 kg
    }
  };
  const handlRefresh = (e) => {
    e.preventDefault();
    setRefresh(true);
    axios
      .get(
        config.APIACTIVATEURL + config.GETDEVICEBALANCE + "?EndDeviceId=" + dashboardData.endDeviceId,
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setTimeout(() => {
            handleSuccess(response.data.message);
            GetUserData();
            setRefresh(false);
          }, 5000); // 30 seconds delay
        }
      });
  };

  const GetUserData = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETDEVICEBYUSER + "?UserId=" + localStorage.getItem("userId"), { ...headerconfig })
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
    <div id="layout-wrapper">
      <Header />
      <SideBar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {/* News Marquee - Now using the reusable component */}
            <div className="row mb-3">
              <div className="col-12">
                <NewsMarquee />
              </div>
            </div>

            {/* Dashboard Metrics */}
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <div className={`card card-animate ${getBalanceCardColor()}`}>
                  <div className="card-body" style={{ minHeight: "180px" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-white">LPG Balance</h5>
                    </div>
                    <h2 className="text-white mt-3">
                      {dashboardData?.gasAvailable} Kgs
                    </h2>
                    {dashboardData?.gasAvailable <= 2 && (
                      <div className="mt-3 d-flex justify-content-center">
                        {/* <Link
                          to="/recharge"
                          className="btn btn-light btn-lg fw-bold"
                          style={{
                            width: "75%",
                            fontSize: "0.7rem",
                            color: "#000",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <i className="ri-refresh-line me-2"></i>
                          {dashboardData?.gasAvailable <= 0
                            ? "NO BALANCE, RECHARGE TO USE"
                            : "LOW BALANCE"}
                        </Link> */}
                      </div>
                    )}
                    {dashboardData?.gasLastUpdated==='0001-01-01T00:00:00'?'':
                    <p>Last Updated: {moment.utc(dashboardData?.gasLastUpdated).local().format('DD MMM YYYY hh:mm a')}</p>}
                    <div className="hstack gap-2 justify-content-end">
                      {refresh === false ?
                        <button className="btn btn-sm btn-warning" onClick={handlRefresh}>Update Balance</button> :
                        <button className="btn btn-sm btn-warning" disabled>Updating...</button>}
                        {dashboardData?.gasAvailable <= 0?
                          <Link to={"/recharge"} className="btn btn-sm btn-warning text-white">No Balance.. Recharge Now</Link>:
                          dashboardData?.gasAvailable <= 2?
                          <Link to={"/recharge"} className="btn btn-sm btn-warning text-black">Low Balance.. Recharge Now</Link>:""
                        }
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6">
                <div
                  className="card card-animate bg-primary"
                  style={{ minHeight: "180px" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-white">Today's Consumption</h5>
                    </div>
                    <h2 className="text-white mt-3">
                      {`${dashboardData?.lastGasUsage===null?0:dashboardData?.lastGasUsage} kgs`}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6">
                <div
                  className="card card-animate bg-warning"
                  style={{ minHeight: "180px" }}
                >
                  <div className="card-body">
                    <h5 className="text-white">
                      Last Consumption
                    </h5>
                    <h2 className="text-white mt-3">
                      {`${dashboardData?.lastGasUsage===null?0:dashboardData?.lastGasUsage} kgs`}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <ConsumerDetails></ConsumerDetails>
            <CustomerNotifications></CustomerNotifications>
          </div>
        </div>
      </div>
    </div>
  );
}
