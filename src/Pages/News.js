import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";

import moment from "moment";

const initialFieldValues = {
  newsId: "00000000-0000-0000-0000-000000000000",
  selectedOrganisations: [],
  message: "",
  createdDate: new Date(),
  isActive: true,
};

export default function News() {
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [newsList, setNewsList] = useState([]);
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

  const showEditDetails = (data) => {
    setRecordForEdit(data);
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    GetNews(pageNumber);
    setErrors({});
  };

  const GetLastPageData = () => {
    GetNews(totalPages);
  };

  const GetFirstPageData = () => {
    GetNews(1);
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetNews(number);
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
    temp.message = values.message === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        newsId:values.newsId,
        message: values.message,
        createdDate: values.createdDate,
        isActive: values.isActive === "true" ? true : values.isActive === "false"? false : values.isActive,
      };
      addOrEdit(formData);
    }
  };

  const newsAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(
          config.APIACTIVATEURL + config.CREATENEWS,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
      update: (updateRecord) =>
        axios.put(config.APIACTIVATEURL + config.UPDATENEWS, updateRecord, {
          ...headerconfig,
        }),
      delete: (id) =>
        axios.delete(config.APIACTIVATEURL + config.DELETENEWS + "/" + id, {
          ...headerconfig,
        }),
    };
  };

  const addOrEdit = (formData) => {
    if (formData.newsId === "00000000-0000-0000-0000-000000000000") {
      newsAPI()
        .create(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetNews(1);
          } else {
            handleError(res.data.data);
          }
        });
    } else {
      newsAPI()
        .update(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetNews(1);
          } else {
            handleError(res.data.data);
          }
        });
    }
  };

  const GetNews = (number) => {
    axios.get(config.APIACTIVATEURL + config.GETNEWS + "?pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setNewsList(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?"))
      newsAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("News deleted successfully");
          GetNews(1);
        });
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";

  useEffect(() => {
    GetNews(pageNumber);
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
                  <h4 className="mb-sm-0">News Management</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">News</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row">
                  <div className="col-lg-5">
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label">
                        News Message
                      </label>
                      <input
                        type="text"
                        value={values.message}
                        name="message"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("message")}
                        placeholder="Enter message"
                      />
                      {errors.message === false && (
                        <div className="text-danger small mt-1">
                          Please enter news message
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
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newsList.length > 0 &&
                            newsList.map((news, index) => (
                              <tr key={news.newsId}>
                                <td>{index + 1}</td>
                                <td>{news.message}</td>
                                <td>
                                  {moment(news.createdDate).format(
                                    "DD/MM/YYYY"
                                  )}
                                </td>
                                <td>
                                  {news.isActive ? (
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
                                      title="Edit"
                                    >
                                      <Link
                                        className="edit-item-btn"
                                        onClick={(e) => showEditDetails(news)}
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
                                          onDelete(e, news.newsId)
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
                          <span className="fw-semibold">{newsList.length}</span>{" "}
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
