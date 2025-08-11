import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import "./MobileCustomerDistributer.css";

export default function CustomerDistributer() {
  const [values, setValues] = useState({});

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
          config.GETDISTRIBUTERBYUSER +
          "?UserId=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setValues(response.data.data);
        }
      });
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="mobile-distributer-card">
      <div className="card-body">
        <h4 className="card-title">Distributer Details</h4>
        <ul className="distributer-list">
          <li className="distributer-item">Name: {values.distributerName}</li>
          <li className="distributer-item">Phone No: {values.phoneNumber}</li>
          <li className="distributer-item">Email: {values.email}</li>
          <li className="distributer-item">Location: {values.locationName}</li>
          <li className="distributer-item">Address: {values.address}</li>
          <li className="distributer-item">PinCode: {values.pinCode}</li>
          <li className="distributer-item disclaimer">
            <b>***Disclaimer: Contact Distributer to update your KYC</b>
          </li>
        </ul>
      </div>
    </div>
  );
}
