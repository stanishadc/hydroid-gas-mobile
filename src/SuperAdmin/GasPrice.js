import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";

const initialFieldValues = {
  gasPriceId: "00000000-0000-0000-0000-000000000000",
  quantity: "1",
  price: 0,
  pricePerKg: 0,
  createdDate: new Date(),
  isActive: true,
};

export default function GasPrice() {
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [gasPriceList, setGasPriceList] = useState([]);
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
    const { name, value } = e.target;
    const updatedValues = {
      ...values,
      [name]: value,
    };
    setValues(updatedValues);
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
    setRecordForEdit(null);
    GetGasPrices(pageNumber);
    setErrors({});
  };

  const GetLastPageData = () => {
    GetGasPrices(totalPages);
  };

  const GetFirstPageData = () => {
    GetGasPrices(1);
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetGasPrices(number);
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
    temp.gasPriceId = values.gasPriceId === "" ? false : true;
    temp.price = values.price <= 0 ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Show confirmation dialog
      if (!window.confirm("Are you sure you want to create a new gas price?")) {
        return; // User clicked Cancel, do nothing
      }

      const formData = {
        gasPriceId: values.gasPriceId,
        quantity: values.quantity,
        price: values.price,
        pricePerKg: values.price,
        createdDate: values.createdDate,
        isActive: true,
      };

      addOrEdit(formData);
    }
  };

  const gasPriceAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(
          config.APIACTIVATEURL + config.CREATEGASPRICE,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
      delete: (id) =>
        axios.delete(config.APIACTIVATEURL + config.DELETEGASPRICE + "/" + id, {
          ...headerconfig,
        }),
    };
  };

  const addOrEdit = (formData) => {
    if (formData.gasPriceId === "00000000-0000-0000-0000-000000000000") {
      gasPriceAPI()
        .create(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetGasPrices(1);
          } else {
            handleError(res.data.data);
          }
        });
    }
  };

  const GetGasPrices = (number) => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETGASPRICES +
          "?pageNumber=" +
          number +
          "&pageSize=" +
          pageSize +
          "",
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.data.succeeded === true) {
          setGasPriceList(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };

  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      gasPriceAPI()
        .delete(id)
        .then((res) => {
          const { statusCode, data } = res.data;

          if (statusCode === 200) {
            handleSuccess(data); // "GasPrice Deleted!"
            GetGasPrices(1);
          } else {
            handleError(data); // Show error message from server response
          }
        })
        .catch((err) => {
          handleError("Something went wrong while deleting");
        });
    }
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";

  useEffect(() => {
    GetGasPrices(pageNumber);
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
                  <h4 className="mb-sm-0">Gas Price Management</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Gas Prices</li>
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
                      <label htmlFor="quantity" className="form-label">
                        Quantity(Kg)
                      </label>
                      <input
                        type="text"
                        value={values.quantity}
                        name="quantity"
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="1 kg cylinder"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={values.price}
                        name="price"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("price")}
                        placeholder="Enter price"
                      />
                      {errors.price === false && (
                        <div className="text-danger small mt-1">
                          Please enter valid price
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        value={values.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                        className="form-select"
                      >
                        {statusValues.map((sv) => (
                          <option key={sv.label} value={sv.value}>
                            {sv.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3">
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
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table
                        className="table table-bordered dt-responsive nowrap table-striped align-middle"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gasPriceList.length > 0 &&
                            gasPriceList.map((gasPrice, index) => (
                              <tr key={gasPrice.gasPriceId}>
                                <td>{index + 1}</td>
                                <td>{gasPrice.price.toFixed(2)}</td>
                                <td>
                                  {moment(gasPrice.createdDate).format(
                                    "DD/MM/YYYY"
                                  )}
                                </td>
                                <td>
                                  {gasPrice.isActive ? (
                                    <span className="badge bg-success">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="badge bg-warning">
                                      InActive
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
                                      title="Delete"
                                    >
                                      <Link
                                        className="remove-item-btn"
                                        onClick={(e) =>
                                          onDelete(e, gasPrice.gasPriceId)
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
                            {gasPriceList.length}
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
