import React from "react";
import Block from "./Block";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import Tree from "react-d3-tree";
import "./custom-tree.css";
import CountUp from "react-countup";
const NewTree = () => {
  const [adminTree, setAdminTree] = useState({});
  const [last24hours, setLast24Hours] = useState(0);
  const [weeklyUsage, setWeeklyUsage] = useState(0);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [loading, setLoading] = useState(false);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetDashboardTree = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETORGANISATIONTREE +
          "?OrganisationId=" +
          localStorage.getItem("organisationId"),
        { ...headerconfig }
      )
      .then((response) => {
        setAdminTree(response.data.data);
        // GetWaterUsageCount("");
      });
  };
  const [zoom, setZoom] = React.useState(1);
  const nodeSize = { x: 150, y: 50 };
  const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.2, 2));
  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.5));
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  const handleNodeClick = (nodeData) => {
    // Check if the clicked node is a leaf node (no children)
    if (!nodeData.children || nodeData.children.length === 0) {
      // GetWaterUsageCount(nodeData.name)
    }
  };
  // const GetWaterUsageCount = (username) => {
  //     setLoading(true);
  //     axios
  //         .get(config.APIACTIVATEURL + config.ADMINDASHBOARDCOUNTBYNAME + "?UserName=" + username, { ...headerconfig })
  //         .then((response) => {
  //             setLast24Hours(response.data.data.todayCountData);
  //             setWeeklyUsage(response.data.data.weeklyCount);
  //             setMonthlyUsage(response.data.data.monthlyCount);
  //             setLoading(false);
  //         });
  // };
  useEffect(() => {
    GetDashboardTree();
  }, []);
  return (
    <div>
      {isEmpty(adminTree) ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          <div className="col-lg-4">
            <div className="card" style={{ minHeight: "1000px" }}>
              <div className="card-header align-items-center d-flex"></div>
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-12 col-md-6">
                    {/* card */}
                    <div
                      className="card card-animate"
                      style={{ backgroundColor: "#1e8275" }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p
                              className="text-uppercase fw-medium text-truncate mb-0"
                              style={{ color: "#fff" }}
                            >
                              Today's Usage
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div>
                            {loading === false ? (
                              <h4
                                className="fs-22 fw-semibold ff-secondary mb-4"
                                style={{ color: "#fff" }}
                              >
                                <CountUp end={last24hours} /> litres
                              </h4>
                            ) : (
                              <h4
                                className="fs-22 fw-semibold ff-secondary mb-4"
                                style={{ color: "#fff" }}
                              >
                                loading...
                              </h4>
                            )}
                          </div>
                          <div className="avatar-sm flex-shrink-0">
                            <span
                              className="avatar-title rounded fs-3"
                              style={{ backgroundColor: "#fff" }}
                            >
                              <i className="ri-water-flash-fill text-success" />
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* end card body */}
                    </div>
                    {/* end card */}
                  </div>
                  {/* end col */}
                  <div className="col-xl-12 col-md-6">
                    {/* card */}
                    <div
                      className="card card-animate"
                      style={{ backgroundColor: "#b49f0f" }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p
                              className="text-uppercase fw-medium text-truncate mb-0"
                              style={{ color: "#fff" }}
                            >
                              Last 7 Days Usage
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div>
                            {loading === false ? (
                              <h4
                                className="fs-22 fw-semibold ff-secondary mb-4"
                                style={{ color: "#fff" }}
                              >
                                <CountUp end={weeklyUsage} /> litres
                              </h4>
                            ) : (
                              <h4
                                className="fs-22 fw-semibold ff-secondary mb-4"
                                style={{ color: "#fff" }}
                              >
                                loading...
                              </h4>
                            )}
                          </div>
                          <div className="avatar-sm flex-shrink-0">
                            <span
                              className="avatar-title rounded fs-3"
                              style={{ backgroundColor: "#fff" }}
                            >
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
                  <div className="col-xl-12 col-md-6">
                    {/* card */}
                    <div
                      className="card card-animate"
                      style={{ backgroundColor: "#c15622" }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p
                              className="text-uppercase fw-medium text-truncate mb-0"
                              style={{ color: "#fff" }}
                            >
                              Current Month Usage
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div>
                            {loading === false ? (
                              <h4
                                className="fs-22 fw-semibold ff-secondary mb-4"
                                style={{ color: "#fff" }}
                              >
                                <CountUp end={monthlyUsage} /> litres
                              </h4>
                            ) : (
                              <h4
                                className="fs-22 fw-semibold ff-secondary mb-4"
                                style={{ color: "#fff" }}
                              >
                                loading...
                              </h4>
                            )}
                          </div>
                          <div className="avatar-sm flex-shrink-0">
                            <span
                              className="avatar-title rounded fs-3"
                              style={{ backgroundColor: "#fff" }}
                            >
                              <i className="ri-water-flash-fill text-primary" />
                            </span>
                          </div>
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
          <div className="col-lg-8">
            <div className="card" style={{ minHeight: "1000px" }}>
              <div className="card-header align-items-center d-flex"></div>
              <div className="card-body" style={{ minHeight: "1000px" }}>
                <div
                  style={{ padding: "20px", margin: "20px", height: "1000px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <button
                      variant="contained"
                      className="btn btn-primary"
                      onClick={handleZoomIn}
                    >
                      Zoom In
                    </button>
                    <button
                      variant="contained"
                      className="btn btn-primary"
                      onClick={handleZoomOut}
                    >
                      Zoom Out
                    </button>
                  </div>
                  <div
                    id="treeWrapper"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Tree
                      data={adminTree}
                      rootNodeClassName="node__root"
                      branchNodeClassName="node__branch"
                      leafNodeClassName="node__leaf"
                      pathFunc="elbow"
                      zoom={zoom}
                      orientation="horizontal"
                      nodeSize={nodeSize}
                      style={{ padding: "100px" }}
                      onNodeClick={(node) => handleNodeClick(node.data)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTree;
