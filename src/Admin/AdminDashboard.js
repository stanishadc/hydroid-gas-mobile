import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import CountUp from "react-countup";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import NewTree from "./NewTree";
export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [users, setUsers] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetDashboardCount = () => {
    axios
      .get(config.APIACTIVATEURL + config.ADMINDASHBOARDCOUNT, {
        ...headerconfig,
      })
      .then((response) => {
        setTotalDevices(response.data.devices);
        setTotalUsers(response.data.users);
        setTotalTickets(response.data.tickets);
      });
  };
  const GetUsers = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETALLUSERS, { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setUsers(response.data.data);
        }
      });
  };
  useEffect(() => {
    GetDashboardCount();
    GetUsers();
  }, []);
  return (
    <div id="layout-wrapper">
      <Header></Header>
      <SideBar></SideBar>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="h-100">
                  <div className="row mb-3 pb-1">
                    <div className="col-12">
                      <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1">
                          <h4 className="fs-16 mb-1">
                            Hello, {localStorage.getItem("name")}!
                          </h4>
                          <p className="text-muted mb-0">
                            Here's water consumption details .
                          </p>
                        </div>
                        <div className="mt-3 mt-lg-0">
                          <div className="row g-3 mb-0 align-items-center"></div>
                        </div>
                      </div>
                      {/* end card header */}
                    </div>
                    {/*end col*/}
                  </div>
                  <div className="row">
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate">
                        <div className="card-body bg-success">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-white text-truncate mb-0">
                                Pending Payments
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 text-white">
                                <CountUp end={pendingPayments} /> Bills
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-info rounded fs-3">
                                <i class="ri-money-dollar-circle-line text-white"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate">
                        <div className="card-body bg-warning">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-white text-truncate mb-0">
                                Tickets
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 text-white">
                                <CountUp end={totalTickets} />
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-warning rounded fs-3">
                                <i className="ri-water-flash-fill text-primary" />
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate">
                        <div className="card-body bg-primary">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-white text-truncate mb-0">
                                Users
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 text-white">
                                <CountUp end={totalUsers} />
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-primary rounded fs-3">
                                <i className="ri-water-flash-fill text-primary" />
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                Devices
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                <CountUp end={totalDevices} />
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-primary rounded fs-3">
                                <i className="bx bx-wallet text-primary" />
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                  </div>
                  <NewTree></NewTree>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
