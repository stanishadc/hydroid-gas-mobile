import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import Flatpickr from "react-flatpickr";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import Select from "react-select";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { downloadExcel, useDownloadExcel } from "react-export-table-to-excel";
export default function AdminMeterReading() {
  const date = new Date();
  const [meterReading, setMeterReading] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fromDate, setFromDate] = useState(
    new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [toDate, setToDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [userId, setUserId] = useState("00000000-0000-0000-0000-000000000000");
  const [searchFloor, setSearchFloor] = useState("");
  const [searchBlock, setSearchBlock] = useState("");
  const [searchWing, setSearchWing] = useState("");
  const [floors, setFloors] = useState([]);
  const [wings, setWings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetUsers = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETALLORGANISATIONUSERS +
          "?OrganisationId=" +
          localStorage.getItem("organisationId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setUsers(response.data.data);
          setTempUsers(response.data.data);
        }
      });
  };
  const GetFloorsWingsBlocks = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETDASHBOARDORGANISATION +
          "?OrganisationId=" +
          localStorage.getItem("organisationId"),
        { ...headerconfig }
      )
      .then((response) => {
        setBlocks(response.data.blocks);
        setWings(response.data.wings);
        setFloors(response.data.floors);
      });
  };
  // const GetDevicesData = (number) => {
  //     if (userId.value !== undefined) {
  //         axios
  //             .get(config.APIACTIVATEURL + config.GETADMINMETERREADING + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&UserId=" + userId.value + "&Block=" + searchBlock + "&Wing=" + searchWing + "&Floor=" + searchFloor + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
  //             .then((response) => {
  //                 if (response.data.statusCode == "200") {
  //                     setMeterReading(response.data.data);
  //                     setPageNumber(response.data.pageNumber);
  //                     setPageSize(response.data.pageSize);
  //                     setTotalPages(response.data.totalPages);
  //                     setData(response.data.data);
  //                     setTotalRecords(response.data.totalRecords);
  //                     setLoading(false);
  //                     var usageData = response.data.data;
  //                     const totalUsage = usageData.reduce((sum, item) => sum + item.litres, 0);
  //                     setTotal(totalUsage);
  //                 }
  //                 else {
  //                     setMeterReading([]);
  //                     setLoading(false);
  //                 }
  //             });
  //     }
  //     else {
  //         setLoading(true)
  //         axios
  //             .get(config.APIACTIVATEURL + config.GETADMINMETERREADING + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&UserId=" + userId + "&Block=" + searchBlock + "&Wing=" + searchWing + "&Floor=" + searchFloor + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
  //             .then((response) => {
  //                 if (response.data.statusCode == "200") {
  //                     setMeterReading(response.data.data);
  //                     setPageNumber(response.data.pageNumber);
  //                     setPageSize(response.data.pageSize);
  //                     setTotalPages(response.data.totalPages);
  //                     setData(response.data.data);
  //                     setTotalRecords(response.data.totalRecords);
  //                     setLoading(false);
  //                     var usageData = response.data.data;
  //                     const totalUsage = usageData.reduce((sum, item) => sum + item.litres, 0);
  //                     setTotal(totalUsage);
  //                 }
  //                 else {
  //                     setMeterReading([]);
  //                     setLoading(false);
  //                 }
  //             });
  //     }
  // };
  const GetLastPageData = () => {
    // GetDevicesData(totalPages);
  };
  const GetFirstPageData = () => {
    // GetDevicesData("1");
  };
  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number);
  };
  const GetReports = () => {
    setLoading(true);
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
  const contentRef = useRef();
  const downloadPDF = () => {
    const input = contentRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("meterreading.pdf");
    });
  };
  const exportToExcel = () => {
    var fileName =
      "MeterReading-" +
      moment(fromDate).format("DDMMYYYY") +
      "-" +
      moment(toDate).format("DDMMYYYY");
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert the JSON data to a worksheet
    const ws = XLSX.utils.json_to_sheet(meterReading);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };
  const { onDownload } = useDownloadExcel({
    currentTableRef: contentRef.current,
    filename:
      "MeterReading-" +
      moment(fromDate).format("DDMMYYYY") +
      "-" +
      moment(toDate).format("DDMMYYYY"),
    sheet: "Reading",
  });
  const handleFloor = (floorName) => {
    const filtered = users.filter((item) => item.floor === floorName);
    setUsers(filtered);
    setSearchFloor(floorName);
  };
  const handleBlock = (blockName) => {
    const filtered = users.filter((item) => item.block === blockName);
    setUsers(filtered);
    setSearchBlock(blockName);
  };
  const clearSearch = () => {
    setUsers(tempUsers);
    setSearchBlock("");
    setSearchFloor("");
    setSearchWing("");
  };
  useEffect(() => {
    GetUsers();
    GetFloorsWingsBlocks();
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
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <select
                        value={searchBlock}
                        onChange={(e) => handleBlock(e.target.value)}
                        placeholder="Block"
                        name="Block"
                        className={"form-select"}
                      >
                        <option value="">All Blocks</option>
                        {blocks.map((sv) => (
                          <option value={sv.block}>{sv.block}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        value={searchWing}
                        onChange={(e) => setSearchWing(e.target.value)}
                        placeholder="Wing"
                        name="Wing"
                        className={"form-select"}
                      >
                        <option value="">All Wings</option>
                        {wings.map((sv) => (
                          <option value={sv.wing}>{sv.wing}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        value={searchFloor}
                        onChange={(e) => handleFloor(e.target.value)}
                        placeholder="Floor"
                        name="Floor"
                        className={"form-select"}
                      >
                        <option value="">All Floors</option>
                        {floors.map((sv) => (
                          <option value={sv.floor}>{sv.floor}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-3">
                      <div className="input-group">
                        <Flatpickr
                          className="form-control border-0 dash-filter-picker shadow"
                          options={{
                            dateFormat: "d-m-Y",
                          }}
                          value={fromDate}
                          onChange={(selectedDates, dateStr) => {
                            const firstDate = selectedDates[0];
                            setFromDate(firstDate);
                          }}
                        />

                        <div className="input-group-text bg-primary border-primary text-white">
                          <i className="ri-calendar-2-line" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-group">
                        <Flatpickr
                          className="form-control border-0 dash-filter-picker shadow"
                          options={{
                            dateFormat: "d-m-Y",
                          }}
                          value={toDate}
                          onChange={(selectedDates, dateStr) => {
                            setToDate(selectedDates[0]);
                          }}
                        />
                        <div className="input-group-text bg-primary border-primary text-white">
                          <i className="ri-calendar-2-line" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-4">
                        <Select
                          value={userId}
                          onChange={setUserId}
                          options={users}
                          isSearchable
                        />
                      </div>
                    </div>
                    {/*end col*/}
                    <div className="col-lg-3 d-flex">
                      {loading === true ? (
                        <div className="flex-shrink-0">
                          <button
                            disabled
                            type="button"
                            className="btn btn-success mr-2"
                          >
                            <i className="ri-search-line align-middle me-1" />{" "}
                            Please wait...
                          </button>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <button
                            onClick={GetReports}
                            type="button"
                            className="btn btn-success mr-2"
                          >
                            <i className="ri-search-line align-middle me-1" />{" "}
                            Search
                          </button>
                        </div>
                      )}
                      <div className="flex-shrink-0 ms-2">
                        <button
                          onClick={clearSearch}
                          type="button"
                          className="btn btn-danger"
                        >
                          <i className="ri-search-line align-middle me-1" />{" "}
                          Clear
                        </button>
                      </div>
                    </div>
                    {/*end col*/}
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="card-header align-items-center d-flex">
                          <h5 className="card-title mb-0 flex-grow-1">
                            Meter Reading
                          </h5>
                          <div className="flex-shrink-0">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={downloadPDF}
                            >
                              PDF
                            </button>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={onDownload}
                            >
                              Excel
                            </button>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive table-card">
                            <div ref={contentRef}>
                              <div className="row mt-10 mb-2 p-5">
                                <div className="col-lg-12">
                                  <label>
                                    Organisation :{" "}
                                    {localStorage.getItem("organisationName")}
                                  </label>
                                </div>
                                <div className="col-lg-12">
                                  <label>
                                    Block Name :{" "}
                                    {searchBlock === ""
                                      ? "ALL Blocks"
                                      : searchBlock + " Block"}
                                  </label>
                                </div>
                                <div className="col-lg-12">
                                  <label>
                                    Floor :{" "}
                                    {searchFloor === ""
                                      ? "ALL Floors"
                                      : searchFloor}
                                  </label>
                                </div>
                                <div className="col-lg-12">
                                  <label>
                                    Flat :{" "}
                                    {userId ===
                                    "00000000-0000-0000-0000-000000000000"
                                      ? "ALL Flats"
                                      : userId.label}
                                  </label>
                                </div>
                                <div className="col-lg-12">
                                  <label>
                                    Date :{" "}
                                    {moment(fromDate).format("DD-MM-YYYY")} to{" "}
                                    {moment(toDate).format("DD-MM-YYYY")}
                                  </label>
                                </div>
                              </div>
                              <table
                                id="example"
                                className="table table-bordered dt-responsive nowrap table-striped align-middle"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th data-ordering="false">Id</th>
                                    <th data-ordering="false">Date and Time</th>
                                    <th data-ordering="false">Meter For</th>
                                    <th data-ordering="false">Meter No</th>
                                    <th data-ordering="false">Reading</th>
                                    <th data-ordering="false">Usage</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {meterReading.length > 0 ? (
                                    meterReading.map((mr, index) => (
                                      <tr key={mr.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {moment(mr.createdDate).format(
                                            "MMM Do YYYY hh:mm a"
                                          )}
                                        </td>
                                        <td>{mr.deviceName}</td>
                                        <td>{mr.meterNo}</td>
                                        <td>{mr.payLoad_ASCII}</td>
                                        <td>{mr.litres} Litres</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={6}>No Records</td>
                                    </tr>
                                  )}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan={4}></td>
                                    <td>Total</td>
                                    <td>{total} Litres</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                          <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                            <div className="flex-shrink-0">
                              <div className="text-muted">
                                Showing{" "}
                                <span className="fw-semibold">
                                  {meterReading.length}
                                </span>{" "}
                                of{" "}
                                <span className="fw-semibold">
                                  {totalRecords}
                                </span>{" "}
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
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
