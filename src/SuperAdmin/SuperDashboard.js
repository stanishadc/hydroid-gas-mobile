import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import CountUp from "react-countup";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
export default function SuperDashboard() {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [distributers, setDistributers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetUsers = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETALLCUSTOMERS, { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setUsers(response.data.data);
        }
      });
  };
  const GetDistributers = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETALLDISTRIBUTERS, { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setDistributers(response.data.data);
        }
      });
  };
  const GetDevices = () => {
    axios.get(config.APIACTIVATEURL + config.GETALLDEVICES, { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode == "200") {
          setDevices(response.data.data);
        } else {
          setDevices([]);
        }
      });
  };
  const GetTickets = () => {
    axios.get(config.APIACTIVATEURL + config.GETALLTICKETS, { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode == "200") {
          setTickets(response.data.data);
        } else {
          setTickets([]);
        }
      });
  };
  useEffect(() => {
    GetDistributers();
    GetDevices();
    GetUsers();
    GetTickets();
  }, []);
  return (
    <div id="layout-wrapper">
      <Header></Header>
      <SideBar></SideBar>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row mb-3 pb-1">
              <div className="col-12">
                <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                  <div className="flex-grow-1">
                    <h4 className="fs-16 mb-1">
                      Hello, {localStorage.getItem("name")}!
                    </h4>
                    <p className="text-muted mb-0">
                      Here's Gas consumption details .
                    </p>
                  </div>
                  <div className="mt-3 mt-lg-0">
                    <div className="row g-3 mb-0 align-items-center">
                      <div className="col-auto">
                        <Link
                          to={"/users"}
                          type="button"
                          className="btn btn-soft-success"
                        >
                          <i className="ri-add-circle-line align-middle me-1" />{" "}
                          Add User
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card header */}
              </div>
              {/*end col*/}
            </div>
            <div className="row">
              <div className="col-xl-3 col-md-6">
                {/* card */}
                <div className="card card-animate bg-soft-success">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-truncate mb-0">
                          Distributers
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        <CountUp end={distributers.length} />
                      </h4>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-xl-3 col-md-6">
                {/* card */}
                <div className="card card-animate bg-soft-primary">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-truncate mb-0">
                          Tickets
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                          <CountUp end={tickets.length} />
                        </h4>
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
                <div className="card card-animate bg-soft-danger">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Users
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                          <CountUp end={users.length} />
                        </h4>
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
                <div className="card card-animate bg-soft-secondary">
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
                          <CountUp end={devices.length} />
                        </h4>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
