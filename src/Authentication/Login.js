import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import auth from "../Common/Configurations/Auth";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import "./Login.css"; // Import the CSS file

const initialLoginValues = {
  username: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialLoginValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const applicationAPI = (url = config.APIACTIVATEURL + config.LOGINUSER) => {
    return {
      userlogin: (newRecord) => axios.post(url, newRecord),
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = () => {
    let temp = {};
    temp.username = values.username == "" ? false : true;
    temp.password = values.password == "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x == true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (validate()) {
      try {
        initialLoginValues.username = values.username;
        initialLoginValues.password = values.password;
        checkUser(initialLoginValues);
      } catch (err) {
        handleError("Error" + err);
      }
    } else {
      setLoading(false);
      handleError("Please check the mandatory fields");
    }
  };

  const checkUser = (loginData) => {
    applicationAPI()
      .userlogin(loginData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          handleSuccess("Login Success");
          clearForm();
          auth.ulogin(() => {
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("tokenexpiration", res.data.expiration);
            localStorage.setItem("roleName", res.data.roleName);
            localStorage.setItem("endDeviceId", res.data.endDeviceId);
            localStorage.setItem("name", res.data.name);
            {
              if (res.data.roleName === "SUPERADMIN") {
                navigate("/superadmin/dashboard");
              } else if (res.data.roleName === "ADMIN") {
                navigate("/admin/dashboard");
              } else if (res.data.roleName === "CUSTOMER") {
                navigate("/customer/dashboard");
              }
            }
          });
        } else {
          handleError(res.data.data);
        }
        setLoading(false);
      })
      .catch(function (e) {
        setLoading(false);
        handleError("Please check the credentials");
      });
  };

  function clearForm() {
    values.username = "";
    values.password = "";
  }

  useEffect(() => {
    if (localStorage.getItem("userToken") !== "") {
      if (CheckExpirationTime()) {
        if (localStorage.getItem("roleName") === "Super Admin") {
          navigate("/superadmin/dashboard");
        } else if (localStorage.getItem("roleName") === "Admin") {
          navigate("/admin/dashboard");
        } else if (localStorage.getItem("roleName") === "Customer") {
          navigate("/customer/dashboard");
        }
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);
  function CheckExpirationTime() {
    if (localStorage.getItem("tokenexpiration") !== "") {
      const expiredate = new Date(localStorage.getItem("tokenexpiration"));
      const localdate = new Date();
      if (expiredate > localdate) {
        return true;
      }
    }
    return false;
  }

  const applyErrorClass = (field) =>
    field in errors && errors[field] == false ? " form-control-danger" : "";
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mobile-auth-container">
      <div className="mobile-auth-header">
        <h1>HYDROID</h1>
        <p>GAS METERING SOLUTIONS</p>
      </div>

      <div className="mobile-auth-card">
        <div className="mobile-auth-title">
          <h5>Welcome Back!</h5>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="mobile-form-group">
            <label htmlFor="username">Username*</label>
            <input
              className={"mobile-form-control" + applyErrorClass("username")}
              name="username"
              type="text"
              value={values.username}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
            {errors.username === false && (
              <div className="error-message">Please enter username</div>
            )}
          </div>

          <div className="mobile-form-group">
            <label htmlFor="password">Password*</label>
            <div style={{ position: "relative" }}>
              <input
                className={"mobile-form-control" + applyErrorClass("password")}
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleInputChange}
                placeholder="Password"
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
              >
                <i className={`ri-eye${showPassword ? "-line" : "-fill"}`} />
              </button>
            </div>
            {errors.password === false && (
              <div className="error-message">Please enter password</div>
            )}
          </div>

          <div className="mobile-submit-btn">
            {loading === false ? (
              <button type="submit">Sign In</button>
            ) : (
              <button type="button" disabled>
                Please wait...
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mobile-footer">
        <p>ino-fi solutions pvt ltd @ 2025</p>
      </div>
    </div>
  );
}
