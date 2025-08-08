import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialChangePasswordValues = {
  userId: localStorage.getItem("userId"),
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};
export default function ChangePassword() {
  const [values, setValues] = useState(initialChangePasswordValues);
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
  const clearForm = () => {
    setValues(initialChangePasswordValues);
  };
  const validate = () => {
    let temp = {};
    temp.oldPassword = values.oldPassword === "" ? false : true;
    temp.newPassword = values.newPassword === "" ? false : true;
    temp.confirmPassword = values.confirmPassword === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (values.newPassword === values.confirmPassword) {
        changePassword();
        clearForm();
      } else {
        handleError("New and Confirm Passwords should be same");
      }
    }
  };
  const changePassword = (changePasswordData) => {
    applicationAPI()
      .postchangepassword(changePasswordData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          handleSuccess(res.data.data);
          clearForm();
        } else {
          handleError(res.data.data);
        }
      });
  };
  const applicationAPI = () => {
    return {
      postchangepassword: () =>
        axios.post(
          config.APIACTIVATEURL +
            config.CHANGEPASSWORD +
            "?UserId=" +
            localStorage.getItem("userId") +
            "&OldPassword=" +
            values.oldPassword +
            "&NewPassword=" +
            values.newPassword,
          { ...headerconfig }
        ),
    };
  };
  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";
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
                  <h4 className="mb-sm-0">Change Password</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">
                        Change Password
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label className="form-label">OldPassword</label>
                      <input
                        type="password"
                        value={values.oldPassword}
                        name="oldPassword"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("oldPassword")
                        }
                        placeholder="Old Password"
                      />
                      {errors.oldPassword === false && (
                        <div className="text-danger">
                          Please enter old password
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        value={values.newPassword}
                        name="newPassword"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("newPassword")
                        }
                        placeholder="New Password"
                      />
                      {errors.newPassword === false && (
                        <div className="text-danger">
                          Please enter new password
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("confirmPassword")
                        }
                        placeholder="Confirm Password"
                      />
                      {errors.confirmPassword === false && (
                        <div className="text-danger">
                          Please enter confirm password
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      <button type="submit" className="btn btn-primary">
                        Change Password
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
