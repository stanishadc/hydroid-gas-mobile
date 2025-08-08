import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess } from "../Common/Layouts/CustomAlerts";

const ValveComponent = () => {
  const [devices, setDevices] = useState({});
  const [valveStatus, setValveStatus] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const GetData = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETDEVICEBYUSER + "?UserId=" + localStorage.getItem("userId"), { ...headerconfig })
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
        config.APIACTIVATEURL + config.GETDEVICEBALANCE + "?EndDeviceId=" + devices.endDeviceId,
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setTimeout(() => {
            handleSuccess(response.data.message);
            GetData();
            setRefresh(false);
          }, 5000); // 30 seconds delay
        }
      });
  };
  const toggleValve = () => {
    const newStatus = !valveStatus;
    setValveStatus(newStatus);
    UpdateStatus(newStatus);
  }
  const UpdateStatus = (newStatus) => {
    const formData = {
      "deviceId": devices.deviceId,
      "status": newStatus,
      "userType": "CUSTOMER",
      "requestedValveStatus": newStatus
    }
    axios.put(config.APIACTIVATEURL + config.UPDATEVALVE, formData, { ...headerconfig })
      .then((response) => {
        if (response.data.statusCode === 200) {
          handleSuccess("Request has been submitted");
        }
      });
  };
  useEffect(() => {
    GetData();
  }, []);

  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  return (
    <div className="col-6">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Emergency Valve Control</h4>
          <p className="text-danger">***Toggle to open or close valve</p>
          <div className="table-responsive">
            <div className="valve-switch-container">
              <div className="d-flex align-items-center">
                {!devices.valveStatus && devices.updatedBy === "ADMIN" ? (
                  <><label className="position-relative me-2" style={{ width: "10rem", height: "3rem" }}>
                    <input type="checkbox" className="d-none" checked={valveStatus} disabled />
                    <div className={`rounded-pill h-100 w-100 position-relative overflow-hidden ${!valveStatus ? "bg-dark" : "bg-dark"}`}>
                      <span className="position-absolute text-white fw-bold" style={{ right: "3.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 1, }}>
                        {valveStatus === true ? "OPENED" : "CLOSED"}
                      </span>
                      <div className="bg-white rounded-circle position-absolute shadow-sm" style={{ width: "2.5rem", height: "2.5rem", top: "50%", transform: valveStatus ? "translate(0.5rem, -50%)" : "translate(7rem, -50%)", transition: "transform 0.3s ease", zIndex: 2, }} />
                    </div>
                  </label>
                    <p style={{ color: "red" }}>ADMIN CLOSED THE VALVE</p></>
                )
                  :
                  !devices.valveStatus && !devices.requestedValveStatus && devices.updatedBy === "CUSTOMER" ?
                    (<label className="position-relative me-2" style={{ width: "10rem", height: "3rem" }}>
                      <input type="checkbox" className="d-none" checked={valveStatus} onChange={toggleValve} />
                      <div className={`rounded-pill h-100 w-100 position-relative overflow-hidden ${!valveStatus ? "bg-danger" : "bg-success"}`}>
                        <span className="position-absolute text-white fw-bold" style={{ right: "3.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 1, }}>
                          {valveStatus === true ? "OPENED" : "CLOSED"}
                        </span>
                        <div className="bg-white rounded-circle position-absolute shadow-sm" style={{ width: "2.5rem", height: "2.5rem", top: "50%", transform: valveStatus ? "translate(0.5rem, -50%)" : "translate(7rem, -50%)", transition: "transform 0.3s ease", zIndex: 2, }} />
                      </div>
                    </label>)
                    : !devices.valveStatus && devices.requestedValveStatus && devices.updatedBy === "CUSTOMER" ?
                      (<div><label className="position-relative me-2" style={{ width: "10rem", height: "3rem" }}>
                        <input type="checkbox" className="d-none" checked={valveStatus} disabled />
                        <div className={`rounded-pill h-100 w-100 position-relative overflow-hidden ${!valveStatus ? "bg-dark" : "bg-dark"}`}>
                          <span className="position-absolute text-white fw-bold" style={{ right: "3.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 1, }}>
                            {valveStatus === true ? "OPENED" : "CLOSED"}
                          </span>
                          <div className="bg-white rounded-circle position-absolute shadow-sm" style={{ width: "2.5rem", height: "2.5rem", top: "50%", transform: valveStatus ? "translate(0.5rem, -50%)" : "translate(7rem, -50%)", transition: "transform 0.3s ease", zIndex: 2, }} />
                        </div>
                      </label>
                        <br />
                        <p style={{ color: "red" }}>Already requested for to TURN ON device. Please wait for acknowledgement</p>
                      </div>
                      )
                      : devices.valveStatus && !devices.requestedValveStatus && devices.updatedBy === "CUSTOMER" ?
                        (<div><label className="position-relative me-2" style={{ width: "10rem", height: "3rem" }}>
                          <input type="checkbox" className="d-none" checked={valveStatus} disabled />
                          <div className={`rounded-pill h-100 w-100 position-relative overflow-hidden ${!valveStatus ? "bg-dark" : "bg-dark"}`}>
                            <span className="position-absolute text-white fw-bold" style={{ right: "3.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 1, }}>
                              {valveStatus === true ? "OPENED" : "CLOSED"}
                            </span>
                            <div className="bg-white rounded-circle position-absolute shadow-sm" style={{ width: "2.5rem", height: "2.5rem", top: "50%", transform: valveStatus ? "translate(0.5rem, -50%)" : "translate(7rem, -50%)", transition: "transform 0.3s ease", zIndex: 2, }} />
                          </div>
                        </label>
                          <p style={{ color: "red" }}>Already requested for to TURN OFF device.Please wait for acknowledgement</p>
                        </div>
                        )
                        :
                        (<label className="position-relative me-2" style={{ width: "10rem", height: "3rem" }}>
                          <input type="checkbox" className="d-none" checked={valveStatus} onChange={toggleValve} />
                          <div className={`rounded-pill h-100 w-100 position-relative overflow-hidden ${!valveStatus ? "bg-danger" : "bg-success"}`}>
                            <span className="position-absolute text-white fw-bold" style={{ left: "3.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 1, }}>
                              {valveStatus === true ? "OPENED" : "CLOSED"}
                            </span>
                            <div className="bg-white rounded-circle position-absolute shadow-sm" style={{ width: "2.5rem", height: "2.5rem", top: "50%", transform: valveStatus ? "translate(0.5rem, -50%)" : "translate(7rem, -50%)", transition: "transform 0.3s ease", zIndex: 2, }} />
                          </div>
                        </label>)}
              </div>
              {refresh === false ?
                <button className="btn btn-sm btn-danger" onClick={handlRefresh}>Refresh Now</button> :
                <button className="btn btn-sm btn-danger" disabled>Refreshing...</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValveComponent;
