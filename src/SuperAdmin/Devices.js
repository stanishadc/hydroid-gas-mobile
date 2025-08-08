import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import readXlsxFile from "read-excel-file";
import Select from "react-select";
const initialFieldValues = {
  deviceId: "00000000-0000-0000-0000-000000000000",
  deviceName: "",
  applicationId: "",
  endDeviceId: "",
  meterNo: 0,
  isActive: true,
  gasAvailable: "0",
  valveStatus: false,
  userId: "00000000-0000-0000-0000-000000000000",
  updatedBy: "ADMIN",
  battery: "0",
  tamperDetected: false
};
export default function Devices() {
  const [values, setValues] = useState(initialFieldValues);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState(
    "00000000-0000-0000-0000-000000000000"
  );
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(200);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const statusvalues = [
    { label: "Active", value: true },
    { label: "InActive", value: false },
  ];
  useEffect(() => {
    if (recordForEdit !== null) setValues(recordForEdit);
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
    setDeviceId("00000000-0000-0000-0000-000000000000");
    GetDevices(pageNumber);
    setErrors({});
  };
  const GetLastPageData = () => {
    GetDevices(totalPages);
  };
  const GetFirstPageData = () => {
    GetDevices("1");
  };
  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetDevices(number);
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
    temp.deviceId = values.deviceId === "" ? false : true;
    temp.applicationId = values.applicationId === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const formData = {
        deviceId: values.deviceId,
        endDeviceId: values.endDeviceId,
        deviceName: values.deviceName,
        applicationId: values.applicationId,
        isActive: values.isActive === "true" ? true : values.isActive === "false" ? false : values.isActive,
        meterNo: values.meterNo,
        gasAvailable: values.gasAvailable,
        valveStatus: values.valveStatus === "true" ? true : values.valveStatus === "false" ? false : values.valveStatus,
        updatedBy: values.updatedBy,
        battery: values.battery,
        tamperDetected: values.tamperDetected
      };
      addOrEdit(formData);
    }
  };
  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(
          config.APIACTIVATEURL + config.CREATEDEVICE,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
      update: (updateRecord) =>
        axios.put(config.APIACTIVATEURL + config.UPDATEDEVICE, updateRecord, {
          ...headerconfig,
        }),
      delete: (id) =>
        axios.delete(config.APIACTIVATEURL + config.DELETEDEVICE + "/" + id, {
          ...headerconfig,
        }),
    };
  };
  const addOrEdit = (formData) => {
    if (formData.deviceId === "00000000-0000-0000-0000-000000000000") {
      applicationAPI()
        .create(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetDevices("1");
            setLoading(false);
          } else {
            handleError(res.data.data);
            setLoading(false);
          }
        });
    } else {
      applicationAPI()
        .update(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetDevices("1");
            setLoading(false);
          } else {
            handleError(res.data.data);
            setLoading(false);
          }
        });
    }
  };

  const GetDevices = (number) => {
    axios
      .get(
        config.APIACTIVATEURL +
        config.GETDEVICES +
        "?pageNumber=" +
        number +
        "&pageSize=" +
        pageSize +
        "",
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.data.succeeded === true) {
          setDevices(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };
  const GetAllDevices = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETALLDEVICES, { ...headerconfig })
      .then((response) => {
        setAllDevices(response.data.data);
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?"))
      applicationAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("Device Deleted Succesfully");
          GetDevices(1);
        });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(
        config.APIACTIVATEURL +
        config.GETDEVICEBYID +
        "?DeviceId=" +
        deviceId.value +
        " & pageNumber=" +
        pageNumber +
        "&pageSize=" +
        pageSize +
        "",
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.data.succeeded === true) {
          setDevices(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };
  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";
  useEffect(() => {
    GetDevices(pageNumber);
    GetAllDevices();
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
                  <h4 className="mb-sm-0">Devices</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Devices</li>
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
                      <label htmlFor="endDeviceId" className="form-label">
                        End Device ID
                      </label>
                      <input
                        type="text"
                        value={values.endDeviceId}
                        name="endDeviceId"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("endDeviceId")
                        }
                        placeholder="End Device ID"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-4">
                      <label htmlFor="applicationId" className="form-label">
                        Application ID
                      </label>
                      <input
                        type="text"
                        value={values.applicationId}
                        name="applicationId"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("applicationId")
                        }
                        placeholder="Application ID"
                      />
                      {errors.applicationId === false && (
                        <div className="text-danger small mt-1">
                          Please enter applicationId
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-2 mb-4">
                    <label htmlFor="status" className="form-label"> Status </label>
                    <select value={values.isActive} onChange={handleInputChange} placeholder="Device Status" name="isActive" className={"form-select" + applyErrorClass("status")}>
                      {statusvalues.map((sv) => (
                        <option value={sv.value}>{sv.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-2 mb-4">
                    <label htmlFor="status" className="form-label"> Valve Status </label>
                    <select value={values.valveStatus} onChange={handleInputChange} placeholder="Valve Status" name="valveStatus" className={"form-select" + applyErrorClass("valveStatus")}>
                      <option value={false}>OFF</option>
                      <option value={true}>ON</option>
                    </select>
                  </div>
                  <div className="col-lg-2">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      {loading === true ?
                        <button type="button" disabled className="btn btn-primary">Loading...</button>
                        :
                        <button type="submit" className="btn btn-primary">Submit</button>
                      }
                      <button type="button" className="btn btn-danger" onClick={resetForm}>Cancel</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header align-items-center d-flex">
                    <h5 className="card-title mb-0 flex-grow-1">
                      Devices List
                    </h5>
                    <div className="flex-shrink-0" style={{ width: "400px" }}>
                      <Select
                        value={deviceId}
                        onChange={setDeviceId}
                        options={allDevices}
                        isSearchable
                      />
                    </div>
                    <div className="flex-shrink-0 ms-2">
                      <button
                        className="btn btn-primary"
                        onClick={(e) => handleSearch(e)}
                      >
                        Search
                      </button>
                    </div>
                    <div className="flex-shrink-0 ms-2">
                      <button className="btn btn-danger" onClick={resetForm}>
                        Clear
                      </button>
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
                            <th data-ordering="false">ID</th>
                            <th data-ordering="false">EndDevice</th>
                            <th data-ordering="false">Application</th>
                            <th>Valve Status</th>
                            <th>Gas Balance</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {devices.length > 0 &&
                            devices.map((device, index) => (
                              <tr key={device.deviceId}>
                                <td>{index + 1}</td>
                                <td>{device.endDeviceId}</td>
                                <td>{device.applicationId}</td>
                                <td>
                                  {device.valveStatus === true ? (
                                    <span className="badge bg-success">
                                      ON
                                    </span>
                                  ) : (
                                    <span className="badge bg-warning">
                                      OFF
                                    </span>
                                  )}
                                </td>
                                <td>{device.gasAvailable} Kgs</td>
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
                                        onClick={(e) => showEditDetails(device)}
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
                                          onDelete(e, device.deviceId)
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
                          <span className="fw-semibold">{devices.length}</span>{" "}
                          of <span className="fw-semibold">{totalRecords}</span>{" "}
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
              {/*end col*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
