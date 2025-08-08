import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";

const initialFieldValues = {
  name: "",
  userName: "",
  email: "",
  password: "",
  isActive: false,
  phoneNumber: "",
  location: "",
  city: "",
  address: "",
  roleName: "CUSTOMER",
  distributerId: "00000000-0000-0000-0000-000000000000",
  deviceId: "00000000-0000-0000-0000-000000000000",
};

export default function Users() {
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [distributers, setDistributers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchDistributerId, setSearchDistributerId] = useState("00000000-0000-0000-0000-000000000000");
  const statusvalues = [    
    { label: "InActive", value: false },
    { label: "Active", value: true },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    setErrors({});
  };

  const GetLastPageData = () => {
    GetUsers(searchDistributerId, totalPages);
  };

  const GetFirstPageData = () => {
    GetUsers(searchDistributerId, 1);
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetUsers(searchDistributerId, number);
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

  const validate = () => {
    let temp = {};
    temp.userName = values.userName === "" ? false : true;
    temp.password = values.password === "" ? false : true;
    temp.name = values.name === "" ? false : true;
    temp.email = values.email === "" ? false : true;
    temp.distributerId = values.distributerId === "00000000-0000-0000-0000-000000000000" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        name: values.name,
        userName: values.userName,
        email: values.email,
        password: values.password,
        isActive: values.isActive === "true" ? true : values.isActive === "false"? false : values.isActive,
        phoneNumber: values.phoneNumber,
        roleName: values.roleName,
        city: values.city,
        location: values.location,
        address: values.address,
        distributerId: values.distributerId,
        deviceId: values.deviceId,
      };
      addOrEdit(formData);
    }
  };

  const applicationAPI = () => {
    return {
      create: (newrecord) => axios.post(config.APIACTIVATEURL + config.CREATEUSER, JSON.stringify(newrecord), { ...headerconfig }),
      userstatus: (id, ustatus) => axios.post(config.APIACTIVATEURL + config.USERSTATUS + "?userId=" + id + "&isActive=" + ustatus, { ...headerconfig }),
    };
  };

  const addOrEdit = (formData) => {
    applicationAPI()
      .create(formData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          handleSuccess(res.data.data);
          resetForm();
          GetUsers(searchDistributerId, pageNumber);
        } else {
          handleError(res.data.data);
        }
      });
  };

  const GetUsers = (distributerId, number) => {
    axios
      .get(config.APIACTIVATEURL + config.GETCUSTOMERS + "?pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setUsers(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };

  const onStatus = (e, id, currentStatus, message) => {
    if (window.confirm(message)) {
      const newStatus = !currentStatus;
      applicationAPI()
        .userstatus(id, newStatus)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess("User status changed successfully");
            GetUsers(searchDistributerId, pageNumber);
          } else {
            handleError(res.data.data || "Failed to change status");
          }
        })
        .catch((error) => {
          handleError("Error changing user status");
        });
    }
  };

  const GetDistributers = () => {
    axios.get(config.APIACTIVATEURL + config.GETALLDISTRIBUTERS, { ...headerconfig, })
      .then((response) => {
        setDistributers(response.data.data);
      });
  };
  const GetDevices = () => {
    axios.get(config.APIACTIVATEURL + config.GETALLDEVICES, { ...headerconfig, })
      .then((response) => {
        setDevices(response.data.data);
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    GetUsers(searchDistributerId, pageNumber);
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";

  useEffect(() => {
    GetUsers(searchDistributerId, pageNumber);
    GetDistributers();
    GetDevices();
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
                  <h4 className="mb-sm-0">Customers</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Customers</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="status" className="form-label">Distributers</label>
                      <select value={values.distributerId} onChange={handleInputChange} placeholder="Distributers" name="distributerId" className={"form-select" + applyErrorClass("distributerId")}>
                        <option value="00000000-0000-0000-0000-000000000000">Please select</option>
                        {distributers.map((sv) => (<option value={sv.value}>{sv.label}</option>))}
                      </select>
                      {errors.distributerId === false && (<div className="text-danger small mt-1">Please select</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="status" className="form-label">Devices</label>
                      <select value={values.deviceId} onChange={handleInputChange} placeholder="device" name="deviceId" className={"form-select" + applyErrorClass("deviceId")}>
                        <option value="00000000-0000-0000-0000-000000000000">Please select</option>
                        {devices.map((sv) => (<option value={sv.value}>{sv.label}</option>))}
                      </select>
                      {errors.deviceId === false && (<div className="text-danger small mt-1">Please select</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" value={values.name} name="name" onChange={handleInputChange} className={"form-control" + applyErrorClass("name")} placeholder="Name" />
                      {errors.name === false && (<div className="text-danger small mt-1">Please enter name</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="text" value={values.email} name="email" onChange={handleInputChange} className={"form-control" + applyErrorClass("email")} placeholder="Email" />
                      {errors.email === false && (<div className="text-danger small mt-1">Please enter email</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label">Phone No</label>
                      <input type="text" value={values.phoneNumber} name="phoneNumber" onChange={handleInputChange} className={"form-control" + applyErrorClass("phoneNumber")} placeholder="Phone No" />
                      {errors.phoneNumber === false && (<div className="text-danger small mt-1">Please enter phone</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input type="text" value={values.location} name="location" onChange={handleInputChange} className={"form-control" + applyErrorClass("location")} placeholder="Location" />
                      {errors.location === false && (<div className="text-danger small mt-1">Please enter location</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="city" className="form-label">City</label>
                      <input type="text" value={values.city} name="city" onChange={handleInputChange} className={"form-control" + applyErrorClass("city")} placeholder="City" />
                      {errors.city === false && (<div className="text-danger small mt-1">Please enter city</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input type="text" value={values.address} name="address" onChange={handleInputChange} className={"form-control" + applyErrorClass("address")} placeholder="Address" />
                      {errors.address === false && (<div className="text-danger small mt-1">Please enter address</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">UserName</label>
                      <input type="text" value={values.userName} name="userName" onChange={handleInputChange} className={"form-control" + applyErrorClass("userName")} placeholder="userName" />
                      {errors.userName === false && (<div className="text-danger small mt-1">Please enter userName</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" value={values.password} name="password" onChange={handleInputChange} className={"form-control" + applyErrorClass("password")} placeholder="Password" />
                      {errors.password === false && (<div className="text-danger small mt-1">Please enter password</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        value={values.isActive}
                        onChange={handleInputChange}
                        placeholder="User Status"
                        name="isActive"
                        className={"form-select" + applyErrorClass("status")}
                      >
                        {statusvalues.map((sv) => (
                          <option value={sv.value}>{sv.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  
                  <div className="col-lg-2">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <div className="row g-3">
                      <div className="col-md-2">
                        <select value={searchDistributerId} placeholder="hDistributer" name="searchDistributerId" className="form-select">
                          <option value="00000000-0000-0000-0000-000000000000">
                            All Distributers
                          </option>
                          {distributers.map((sv) => (
                            <option value={sv.value}>{sv.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <div className="hstack gap-2 justify-content-end mb-3">
                          <button
                            type="button"
                            onClick={(e) => handleSearch(e)}
                            className="btn btn-primary"
                          >
                            Search
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              setSearchDistributerId(
                                "00000000-0000-0000-0000-000000000000"
                              );
                              GetUsers(
                                "00000000-0000-0000-0000-000000000000",
                                1
                              );
                            }}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table
                        id="example"
                        className="table table-bordered dt-responsive nowrap table-striped align-middle"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th data-ordering="false">Name</th>
                            <th data-ordering="false">UserName</th>
                            <th data-ordering="false">Email</th>
                            <th data-ordering="false">PhoneNo</th>
                            <th data-ordering="false">Distributer</th>
                            <th data-ordering="false">Device</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0 &&
                            users.map((user) => (
                              <tr key={user.Id}>
                                <td>{user.name}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.distributerName}</td>
                                <td>{user.endDeviceId}</td>
                                <td>
                                  {user.isActive === true ? (
                                    <span className="badge bg-success">
                                      {UserStatus.ACTIVE}
                                    </span>
                                  ) : (
                                    <span className="badge bg-warning">
                                      {UserStatus.INACTIVE}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">
                                    <li
                                      className="list-inline-item"
                                      data-bs-toggle="tooltip"
                                      data-bs-trigger="hover"
                                      data-bs-placement="top"
                                      title={
                                        user.isActive
                                          ? "Deactivate User"
                                          : "Activate User"
                                      }
                                    >
                                      <Link
                                        className="text-muted"
                                        onClick={(e) =>
                                          onStatus(
                                            e,
                                            user.id,
                                            user.isActive,
                                            user.isActive
                                              ? "Are you sure you want to deactivate this user?"
                                              : "Are you sure you want to activate this user?"
                                          )
                                        }
                                      >
                                        {user.isActive ? (
                                          <i className="ri-thumb-up-fill align-bottom text-success" />
                                        ) : (
                                          <i className="ri-thumb-down-fill align-bottom text-danger" />
                                        )}
                                      </Link>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                      <div className="flex-shrink-0">
                        <div className="text-muted">
                          Showing{" "}
                          <span className="fw-semibold">{users.length}</span> of{" "}
                          <span className="fw-semibold">{totalRecords}</span>{" "}
                          Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li
                          className={
                            "page-item" + data.previousPage === null
                              ? "disabled"
                              : ""
                          }
                          onClick={() => GetFirstPageData()}
                        >
                          <Link className="page-link">Previous</Link>
                        </li>
                        {renderPageNumbers}
                        <li
                          className={
                            "page-item" + data.nextPage === null
                              ? "disabled"
                              : ""
                          }
                          onClick={() => GetLastPageData()}
                        >
                          <Link className="page-link">Next</Link>
                        </li>
                      </ul>
                    </div>
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
