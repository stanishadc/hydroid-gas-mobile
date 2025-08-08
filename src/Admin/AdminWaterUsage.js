import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import Flatpickr from "react-flatpickr";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import config from "../Common/Configurations/APIConfig";
import Select from "react-select";
export default function AdminWaterUsage() {
  const date = new Date();
  const [fromDate, setFromDate] = useState(
    new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [toDate, setToDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("00000000-0000-0000-0000-000000000000");
  const [barGraphLabels, setBarGraphLabels] = useState([]);
  const [barGraphSeries, setBarGraphSeries] = useState([]);
  const [searchFloor, setSearchFloor] = useState("");
  const [searchBlock, setSearchBlock] = useState("");
  const [searchWing, setSearchWing] = useState("");
  const [floors, setFloors] = useState([]);
  const [wings, setWings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const WaterConsumptionHourly = () => {
    var options = {
      chart: {
        type: "bar",
        toolbar: {
          show: true,
          tools: {
            download: false, // Disable the download button
          },
        },
      },
      xaxis: {
        categories: barGraphLabels,
      },
    };
    const series = [
      {
        name: barGraphLabels,
        data: barGraphSeries,
      },
    ];
    return (
      <ReactApexChart
        className="apex-charts"
        series={series}
        options={options}
        type="bar"
        height={267.7}
      />
    );
  };
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
  // const GetBarGraphData = () => {
  //     if (userId.value !== undefined) {
  //         axios
  //             .post(config.APIACTIVATEURL + config.GETADMINBARGRAPH + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&UserId=" + userId.value + "&OrganisationId=" + localStorage.getItem('organisationId') + "&Block=" + searchBlock + "&Wing=" + searchWing + "&Floor=" + searchFloor, { ...headerconfig })
  //             .then((response) => {
  //                 setBarGraphLabels(response.data.data.labels);
  //                 setBarGraphSeries(response.data.data.series);
  //                 setLoading(false);
  //             });
  //     }
  //     else {
  //         axios
  //             .post(config.APIACTIVATEURL + config.GETADMINBARGRAPH + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&OrganisationId=" + localStorage.getItem('organisationId') + "&Block=" + searchBlock + "&Wing=" + searchWing + "&Floor=" + searchFloor, { ...headerconfig })
  //             .then((response) => {
  //                 setBarGraphLabels(response.data.data.labels);
  //                 setBarGraphSeries(response.data.data.series);
  //                 setLoading(false);
  //             });
  //     }
  // };
  const GetReports = () => {
    setLoading(true);
    // GetBarGraphData();
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
                        onChange={(e) => setSearchBlock(e.target.value)}
                        placeholder="Block"
                        name="Block"
                        className={"form-select"}
                      >
                        <option value="">Block</option>
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
                        <option value="">Wing</option>
                        {wings.map((sv) => (
                          <option value={sv.wing}>{sv.wing}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        value={searchFloor}
                        onChange={(e) => setSearchFloor(e.target.value)}
                        placeholder="Floor"
                        name="Floor"
                        className={"form-select"}
                      >
                        <option value="">Floor</option>
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
                    <div className="col-lg-3">
                      {loading === true ? (
                        <button
                          disabled
                          type="button"
                          className="btn btn-success"
                        >
                          <i className="ri-search-line align-middle me-1" />{" "}
                          Please wait...
                        </button>
                      ) : (
                        <button
                          onClick={GetReports}
                          type="button"
                          className="btn btn-success"
                        >
                          <i className="ri-search-line align-middle me-1" />{" "}
                          Search
                        </button>
                      )}
                    </div>
                    {/*end col*/}
                  </div>
                  <div className="row mb-3">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header border-0 align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">
                            Water Consumption - Last Updated{" "}
                            {moment(new Date()).format("Do MMM YYYY, h:mm a")}
                          </h4>
                        </div>
                        <div className="card-body p-0 pb-2">
                          <div className="w-100">
                            <WaterConsumptionHourly
                              type="bar"
                              id="Market_chart"
                              data-colors='["--vz-success", "--vz-danger"]'
                            />
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
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
