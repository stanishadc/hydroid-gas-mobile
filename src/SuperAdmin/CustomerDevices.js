import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import ValveSwitch from "../Pages/ValveComponent";
import { Link } from "react-router-dom";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";

export default function CustomerDevices() {
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${config.APIACTIVATEURL}${config.GETALLUSERS}`,
          headerconfig
        );
        setUsers(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const fetchDevices = async (userId) => {
    try {
      const response = await axios.get(
        `${config.APIACTIVATEURL}${config.GETDEVICEBYUSERID}/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headerconfig
      );

      if (response.data?.data?.data) {
        setDevices(response.data.data.data);
        setPageNumber(response.data.data.pageNumber);
        setPageSize(response.data.data.pageSize);
        setTotalPages(response.data.data.totalPages);
        setData(response.data.data);
        setTotalRecords(response.data.data.totalRecords);
      } else if (response.data?.data) {
        setDevices(response.data.data);
      } else {
        setDevices([]);
        setError("No devices found for this user");
      }
    } catch (err) {
      setError("Failed to fetch devices");
      console.error("Error fetching devices:", err);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      fetchDevices(userId);
    } else {
      setDevices([]);
    }
  };

  const handleReset = () => {
    setSelectedUserId("");
    setDevices([]);
    setPageNumber(1);
    setError(null);
  };

  const handleValveStatusChange = (deviceId, newStatus) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.deviceId === deviceId
          ? { ...device, valveStatus: newStatus }
          : device
      )
    );
  };

  const GetLastPageData = () => {
    if (selectedUserId) fetchDevices(selectedUserId, totalPages);
  };

  const GetFirstPageData = () => {
    if (selectedUserId) fetchDevices(selectedUserId, 1);
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number && selectedUserId)
      fetchDevices(selectedUserId, number);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li
        className="page-item"
        key={number}
        id={number}
        onClick={() => GetPageData(number)}
      >
        <Link className="page-link">{number}</Link>
      </li>
    );
  });

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
                  <h4 className="mb-sm-0">Customer Devices Management</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">
                        Customer Devices
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* User Dropdown with Clear Button */}
            <div className="alert alert-success">
              <div className="row">
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label htmlFor="userSelect" className="form-label">
                      Select User
                    </label>
                    <select
                      id="userSelect"
                      className="form-control"
                      value={selectedUserId}
                      onChange={handleUserChange}
                    >
                      <option value="">-- Select User --</option>
                      {users.map((user) => (
                        <option key={user.value} value={user.value}>
                          {user.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="hstack gap-2 justify-content-start mb-3 mt-4">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleReset}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            {/* Devices List */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table
                        className="table table-bordered dt-responsive nowrap table-striped align-middle"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Device Name</th>

                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {devices.length > 0 ? (
                            devices.map((device, index) => (
                              <tr key={device.deviceId}>
                                <td>{index + 1}</td>
                                <td>{device.deviceName}</td>

                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">
                                    <li
                                      className="list-inline-item"
                                      data-bs-toggle="tooltip"
                                      data-bs-trigger="hover"
                                      data-bs-placement="top"
                                      title="Toggle Valve"
                                    >
                                      <ValveSwitch
                                        deviceId={device.deviceId}
                                        initialStatus={device.valveStatus}
                                        onStatusChange={(newStatus) =>
                                          handleValveStatusChange(
                                            device.deviceId,
                                            newStatus
                                          )
                                        }
                                      />
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                {selectedUserId
                                  ? "No devices found for selected user"
                                  : "Please select a user to view devices"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {devices.length > 0 && (
                      <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                        <div className="flex-shrink-0">
                          <div className="text-muted">
                            Showing{" "}
                            <span className="fw-semibold">
                              {devices.length}
                            </span>{" "}
                            of{" "}
                            <span className="fw-semibold">{totalRecords}</span>{" "}
                            Results
                          </div>
                        </div>
                        <ul className="pagination pagination-separated pagination-sm mb-0">
                          <li
                            className={
                              "page-item" +
                              (data?.previousPage === null ? " disabled" : "")
                            }
                            onClick={() => GetFirstPageData()}
                          >
                            <Link className="page-link">Previous</Link>
                          </li>
                          {renderPageNumbers}
                          <li
                            className={
                              "page-item" +
                              (data?.nextPage === null ? " disabled" : "")
                            }
                            onClick={() => GetLastPageData()}
                          >
                            <Link className="page-link">Next</Link>
                          </li>
                        </ul>
                      </div>
                    )}
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
