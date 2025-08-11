import { useState } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import MobileFooter from "../Common/Layouts/MobileFooter";
import "./ChangePassword.css";

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
    <div className="mobile-change-password-container">
      {/* Mobile Header */}
      <div className="mobile-change-password-header">
        <h4>Change Password</h4>
      </div>

      {/* Content Area */}
      <div className="mobile-change-password-content">
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="form-group">
            <label className="form-label">Old Password</label>
            <input
              type="password"
              value={values.oldPassword}
              name="oldPassword"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("oldPassword")}
              placeholder="Old Password"
            />
            {errors.oldPassword === false && (
              <div className="error-message">Please enter old password</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={values.newPassword}
              name="newPassword"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("newPassword")}
              placeholder="New Password"
            />
            {errors.newPassword === false && (
              <div className="error-message">Please enter new password</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("confirmPassword")}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword === false && (
              <div className="error-message">Please enter confirm password</div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  );
}
