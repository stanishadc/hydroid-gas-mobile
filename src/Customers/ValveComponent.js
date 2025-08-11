import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess } from "../Common/Layouts/CustomAlerts";
import "./MobileValveComponent.css";

const ValveComponent = () => {
  const [devices, setDevices] = useState({});
  const [valveStatus, setValveStatus] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const GetData = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETDEVICEBYUSER +
          "?UserId=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setDevices(response.data.data);
          setValveStatus(response.data.data.valveStatus);
        }
      });
  };

  const handlRefresh = (e) => {
    e.preventDefault();
    setRefresh(true);
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETDEVICEBALANCE +
          "?EndDeviceId=" +
          devices.endDeviceId,
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setTimeout(() => {
            handleSuccess(response.data.message);
            GetData();
            setRefresh(false);
          }, 5000);
        }
      });
  };

  const toggleValve = () => {
    const newStatus = !valveStatus;
    setValveStatus(newStatus);
    UpdateStatus(newStatus);
  };

  const UpdateStatus = (newStatus) => {
    const formData = {
      deviceId: devices.deviceId,
      status: newStatus,
      userType: "CUSTOMER",
      requestedValveStatus: newStatus,
    };
    axios
      .put(config.APIACTIVATEURL + config.UPDATEVALVE, formData, {
        ...headerconfig,
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          handleSuccess("Request has been submitted");
        }
      });
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="mobile-valve-card">
      <div className="card-body">
        <h4 className="card-title">Emergency Valve Control</h4>
        <p className="text-danger">***Toggle to open or close valve</p>

        <div className="valve-switch-container">
          <div className="d-flex align-items-center">
            {!devices.valveStatus && devices.updatedBy === "ADMIN" ? (
              <>
                <label className="valve-switch">
                  <input
                    type="checkbox"
                    className="d-none"
                    checked={valveStatus}
                    disabled
                  />
                  <div
                    className={`valve-slider ${
                      !valveStatus ? "bg-dark" : "bg-dark"
                    }`}
                  >
                    <span className="valve-text">
                      {valveStatus === true ? "OPENED" : "CLOSED"}
                    </span>
                    <div className="valve-handle" />
                  </div>
                </label>
                <p className="valve-message">ADMIN CLOSED THE VALVE</p>
              </>
            ) : !devices.valveStatus &&
              !devices.requestedValveStatus &&
              devices.updatedBy === "CUSTOMER" ? (
              <label className="valve-switch">
                <input
                  type="checkbox"
                  className="d-none"
                  checked={valveStatus}
                  onChange={toggleValve}
                />
                <div
                  className={`valve-slider ${
                    !valveStatus ? "bg-danger" : "bg-success"
                  }`}
                >
                  <span className="valve-text">
                    {valveStatus === true ? "OPENED" : "CLOSED"}
                  </span>
                  <div className="valve-handle" />
                </div>
              </label>
            ) : !devices.valveStatus &&
              devices.requestedValveStatus &&
              devices.updatedBy === "CUSTOMER" ? (
              <div>
                <label className="valve-switch">
                  <input
                    type="checkbox"
                    className="d-none"
                    checked={valveStatus}
                    disabled
                  />
                  <div
                    className={`valve-slider ${
                      !valveStatus ? "bg-dark" : "bg-dark"
                    }`}
                  >
                    <span className="valve-text">
                      {valveStatus === true ? "OPENED" : "CLOSED"}
                    </span>
                    <div className="valve-handle" />
                  </div>
                </label>
                <p className="valve-message">
                  Already requested to TURN ON device. Please wait for
                  acknowledgement
                </p>
              </div>
            ) : devices.valveStatus &&
              !devices.requestedValveStatus &&
              devices.updatedBy === "CUSTOMER" ? (
              <div>
                <label className="valve-switch">
                  <input
                    type="checkbox"
                    className="d-none"
                    checked={valveStatus}
                    disabled
                  />
                  <div
                    className={`valve-slider ${
                      !valveStatus ? "bg-dark" : "bg-dark"
                    }`}
                  >
                    <span className="valve-text">
                      {valveStatus === true ? "OPENED" : "CLOSED"}
                    </span>
                    <div className="valve-handle" />
                  </div>
                </label>
                <p className="valve-message">
                  Already requested to TURN OFF device. Please wait for
                  acknowledgement
                </p>
              </div>
            ) : (
              <label className="valve-switch">
                <input
                  type="checkbox"
                  className="d-none"
                  checked={valveStatus}
                  onChange={toggleValve}
                />
                <div
                  className={`valve-slider ${
                    !valveStatus ? "bg-danger" : "bg-success"
                  }`}
                >
                  <span className="valve-text">
                    {valveStatus === true ? "OPENED" : "CLOSED"}
                  </span>
                  <div className="valve-handle" />
                </div>
              </label>
            )}
          </div>

          {refresh === false ? (
            <button className="refresh-button" onClick={handlRefresh}>
              Refresh Now
            </button>
          ) : (
            <button className="refresh-button" disabled>
              Refreshing...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValveComponent;
