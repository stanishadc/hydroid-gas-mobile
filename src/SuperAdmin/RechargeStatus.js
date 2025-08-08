import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import Select from "react-select";
export default function Recharges() {
  const [recharges, setRecharges] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetRecharge = () => {
    axios
      .get(`${config.APIACTIVATEURL}${config.GETRECHARGE}`, headerconfig)
      .then((response) => {
        setRecharges(response.data.data.data);
      });
  };
  useEffect(() => {
    GetRecharge();
  }, []);

  return (
    <div id="layout-wrapper">
      <Header></Header>
      <SideBar></SideBar>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Recharges</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Recharges</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Recharges List</h5>
                  </div>
                  <div className="card-body">
                    <table
                      id="example"
                      className="table table-bordered dt-responsive nowrap table-striped align-middle"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Device</th>
                          <th>Quantity & Price</th>
                          <th>Payment Status</th>
                          <th>Recharge Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recharges.length > 0 &&
                          recharges.map((recharge) => (
                            <tr key={recharge.rechargeId}>
                              <td>{recharge.userName}</td>
                              <td>{recharge.endDeviceId}</td>
                              <td>Quantity : {recharge.quantity} Kgs
                                <br />Amount : {recharge.amount} INR
                                <br />Price : {recharge.pricePerKg} per Kg
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${
                                    recharge.paymentStatus === "Success"
                                      ? "success"
                                      : recharge.paymentStatus === "Failed"
                                      ? "danger"
                                      : recharge.paymentStatus === "Refunded"
                                      ? "warning"
                                      : "secondary"
                                  }`}
                                >
                                  {recharge.paymentStatus}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${
                                    recharge.rechargeStatus === "Completed"
                                      ? "success"
                                      : recharge.rechargeStatus === "Cancelled"
                                      ? "danger"
                                      : recharge.rechargeStatus === "Processing"
                                      ? "info"
                                      : "primary"
                                  }`}
                                >
                                  {recharge.rechargeStatus}
                                </span>
                              </td>
                              <td>
                                {new Date(
                                  recharge.createdDate
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
