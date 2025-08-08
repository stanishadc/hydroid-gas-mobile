import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
  distributerId: "00000000-0000-0000-0000-000000000000",
  distributerName: "",
  phoneNumber: "",
  email: "",
  address: "",
  isActive: true,
  location: "",
  pinCode: ""
};

export default function Distributer() {
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [distributers, setDistributers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const statusValues = [
    { label: "Active", value: true },
    { label: "InActive", value: false },
  ];

  useEffect(() => {
    if (recordForEdit !== null) {
      setValues(recordForEdit);
    }
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };

  const showEditDetails = (data) => {
    setRecordForEdit(data);
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    GetDistributers(pageNumber);
    setErrors({});
  };

  const GetLastPageData = () => {
    GetDistributers(totalPages);
  };

  const GetFirstPageData = () => {
    GetDistributers(1);
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetDistributers(number);
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
    temp.distributerName = values.distributerName === "" ? false : true;
    temp.phoneNumber = values.phoneNumber === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        "distributerId": values.distributerId,
        "distributerName": values.distributerName,
        "phoneNumber": values.phoneNumber,
        "email": values.email,
        "location": values.location,
        "address": values.address,
        "pinCode": values.pinCode,
        "isActive": values.isActive === "true" ? true : values.isActive === "false"? false : values.isActive,
      };
      addOrEdit(formData);
    }
  };

  const distributerAPI = () => {
    return {
      create: (newrecord) => axios.post(config.APIACTIVATEURL + config.CREATEDISTRIBUTER, JSON.stringify(newrecord), { ...headerconfig }),
      update: (updateRecord) => axios.put(config.APIACTIVATEURL + config.UPDATEDISTRIBUTER, JSON.stringify(updateRecord), { ...headerconfig }),
      delete: (id) => axios.delete(config.APIACTIVATEURL + config.DELETEDISTRIBUTER + "/" + id, { ...headerconfig }),
    };
  };

  const addOrEdit = (formData) => {
    var apiCall = formData.distributerId==="00000000-0000-0000-0000-000000000000"? distributerAPI().create(formData)
      : distributerAPI().update(formData);

    apiCall.then((res) => {
      if (res.data.statusCode === 200) {
        handleSuccess(
          formData.distributerId
            ? "Distributer updated successfully"
            : "Distributer created successfully"
        );
        resetForm();
        GetDistributers(1);
      } else {
        handleError(res.data.data);
      }
    })
      .catch((error) => {
        handleError("Error saving distributer");
      });
  };

  const GetDistributers = (number) => {
    axios.get(config.APIACTIVATEURL + config.GETDISTRIBUTER +"?pageNumber=" + number +"&pageSize=" + pageSize,{ ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setDistributers(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      })
      .catch((error) => {
        handleError("Error fetching distributers");
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this distributer?")) {
      distributerAPI().delete(id)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess("Distributer deleted successfully");
            GetDistributers(1);
          } else {
            handleError(res.data.data);
          }
        })
        .catch((error) => {
          handleError("Error deleting distributer");
        });
    }
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";

  useEffect(() => {
    GetDistributers(pageNumber);
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
                  <h4 className="mb-sm-0">Distributer Management</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Distributers</li>
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
                      <label htmlFor="distributerName" className="form-label">
                        Distributer Name
                      </label>
                      <input type="text" value={values.distributerName} name="distributerName" onChange={handleInputChange} className={"form-control" + applyErrorClass("distributerName")} placeholder="Name"/>
                      {errors.distributerName === false && (<div className="text-danger small mt-1">Please enter distributer name</div>)}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={values.phoneNumber}
                        name="phoneNumber"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("phoneNumber")
                        }
                        placeholder="Phone"
                        maxLength={15}
                      />
                      {errors.phoneNumber === false && (
                        <div className="text-danger small mt-1">
                          Please enter phone number
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        value={values.email}
                        name="email"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("email")}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Location
                      </label>
                      <input
                        type="text"
                        value={values.location}
                        name="location"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("location")}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="pinCode" className="form-label">
                        PinCode
                      </label>
                      <input
                        type="text"
                        value={values.pinCode}
                        name="pinCode"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("pinCode")}
                        placeholder="PinCode"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        value={values.address}
                        name="address"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("address")}
                        placeholder="Address"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="isActive" className="form-label">
                        Status
                      </label>
                      <select
                        value={values.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                        className={"form-select" + applyErrorClass("isActive")}
                      >
                        {statusValues.map((sv) => (
                          <option key={sv.label} value={sv.value}>
                            {sv.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      <button type="submit" className="btn btn-primary">
                        {values.distributerId ===
                          "00000000-0000-0000-0000-000000000000"
                          ? "Submit"
                          : "Update"}
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
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table
                        className="table table-bordered dt-responsive nowrap table-striped align-middle"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {distributers.length > 0 &&
                            distributers.map((distributer, index) => (
                              <tr key={distributer.distributerId}>
                                <td>{index + 1}</td>
                                <td>{distributer.distributerName}</td>
                                <td>{distributer.phoneNumber}</td>
                                <td>{distributer.email}</td>
                                <td>{distributer.location}</td>
                                <td>{distributer.isActive ? 
                                (<span className="badge bg-success">Active</span>) : 
                                (<span className="badge bg-warning">InActive</span>)}
                                </td>
                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">
                                    <li
                                      className="list-inline-item"
                                      data-bs-toggle="tooltip"
                                      data-bs-trigger="hover"
                                      data-bs-placement="top"
                                      title="Edit"
                                    >
                                      <Link
                                        className="edit-item-btn"
                                        onClick={(e) =>
                                          showEditDetails(distributer)
                                        }
                                      >
                                        <i className="ri-pencil-fill align-bottom text-muted" />
                                      </Link>
                                    </li>
                                    <li
                                      className="list-inline-item"
                                      data-bs-toggle="tooltip"
                                      data-bs-trigger="hover"
                                      data-bs-placement="top"
                                      title="Delete"
                                    >
                                      <Link
                                        className="remove-item-btn"
                                        onClick={(e) =>
                                          onDelete(e, distributer.distributerId)
                                        }
                                      >
                                        <i className="ri-delete-bin-fill align-bottom text-muted" />
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
                          <span className="fw-semibold">
                            {distributers.length}
                          </span>{" "}
                          of <span className="fw-semibold">{totalRecords}</span>{" "}
                          Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li
                          className={
                            "page-item" +
                            (data.previousPage === null ? " disabled" : "")
                          }
                          onClick={() => GetFirstPageData()}
                        >
                          <Link className="page-link">Previous</Link>
                        </li>
                        {renderPageNumbers}
                        <li
                          className={
                            "page-item" +
                            (data.nextPage === null ? " disabled" : "")
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
