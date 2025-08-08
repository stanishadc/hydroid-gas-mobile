import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
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
    <div id="layout-wrapper">
      <Header></Header>
      <SideBar></SideBar>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">User Profile</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">User Profile</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row align-items-end">
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        value={values.name}
                        name="name"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("name")}
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        value={values.email}
                        name="email"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("email")}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="phoneNo" className="form-label">
                        Phone No
                      </label>
                      <input
                        type="text"
                        value={values.phoneNumber}
                        name="phoneNumber"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("phoneNumber")
                        }
                        placeholder="Phone No"
                        maxLength={12}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        value={values.city}
                        name="city"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("city")}
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-4">
                      <button type="submit" className="btn btn-primary w-100">
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
