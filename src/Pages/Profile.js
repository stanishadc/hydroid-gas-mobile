import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import MobileFooter from "../Common/Layouts/MobileFooter";
import "./Profile.css";

const initialFieldValues = {
  userId: "00000000-0000-0000-0000-000000000000",
  name: "",
  email: "",
  phoneNumber: "",
  city: "",
  country: "INDIA",
};

export default function UserProfile() {
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    let temp = {};
    temp.name = values.name === "" ? false : true;
    temp.email = values.email === "" ? false : true;
    temp.phoneNumber = values.phoneNumber === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        id: localStorage.getItem("userId"),
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        city: values.city,
        country: values.country,
      };
      addOrEdit(formData);
    }
  };

  const applicationAPI = () => {
    return {
      update: (newrecord) =>
        axios.post(
          config.APIACTIVATEURL + config.USERPROFILE,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
    };
  };

  const addOrEdit = (formData) => {
    applicationAPI()
      .update(formData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          handleSuccess(res.data.data);
          GetUserData();
        } else {
          handleError(res.data.data);
        }
      });
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
        setValues({
          ...response.data.data,
          country: response.data.data.country || "INDIA",
        });
      });
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";

  useEffect(() => {
    GetUserData();
  }, []);

  return (
    <div className="mobile-profile-container">
      {/* Mobile Header */}
      <div className="mobile-profile-header">
        <h4>User Profile</h4>
      </div>

      {/* Mobile Form */}
      <div className="mobile-profile-content">
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={values.name}
              name="name"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("name")}
              placeholder="Name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={values.email}
              name="email"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("email")}
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label>Phone No</label>
            <input
              type="text"
              value={values.phoneNumber}
              name="phoneNumber"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("phoneNumber")}
              placeholder="Phone No"
              maxLength={12}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={values.city}
              name="city"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("city")}
              placeholder="City"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Update Profile
          </button>
        </form>
      </div>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  );
}
