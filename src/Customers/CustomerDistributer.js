import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
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
            .get(config.APIACTIVATEURL + config.GETDISTRIBUTERBYUSER + "?UserId=" + localStorage.getItem("userId"), { ...headerconfig })
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
        <div className="col-md-6">
            <div className="card h-100">
                <div className="card-body">
                    <h4 className="card-title">Distributer Details</h4>
                    <ul className="list-group">
                      <li className="list-group-item">Name : {values.distributerName}</li>
                      <li className="list-group-item">Phone No : {values.phoneNumber}</li>
                      <li className="list-group-item">Email: {values.email}</li>
                      <li className="list-group-item">Location : {values.locationName}</li>
                      <li className="list-group-item">Address: {values.address}</li>
                      <li className="list-group-item">PinCode: {values.pinCode}</li>
                      <li className="list-group-item"><b>***Disclaimer : Contact Distributer to update your KYC</b></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
