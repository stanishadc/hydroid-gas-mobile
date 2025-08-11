import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
export default function ConsumerDetails() {
  const [consumerDetails, setConsumerDetails] = useState({});
  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const GetUserData = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETUSERBYID +
          "?Id=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setConsumerDetails(response.data.data);
        }
      });
  };

  useEffect(() => {
    GetUserData();
  }, []);

  return (
    <div className="mobile-distributer-card">
      <div className="card-body">
        <h4 className="card-title">Consumer Details</h4>
        <ul className="distributer-list">
          <li className="distributer-item">Name:{consumerDetails?.name}</li>

          <li className="distributer-item">Email: {consumerDetails?.email}</li>
          <li className="distributer-item">
            Phone: {consumerDetails?.phoneNumber}
          </li>
          <li className="distributer-item">
            Address: {consumerDetails?.address}
          </li>
        </ul>
      </div>
    </div>
  );
}
