import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../Configurations/Auth";
import NotificationsUI from "./NotificationsUI";
import moment from "moment";
import axios from "axios";
import config from "../Configurations/APIConfig";
export default function Header(props) {
  const [username, setUserName] = useState(localStorage.getItem("name"));
  const navigate = useNavigate();
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
  const [messageData, setMessageData] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetPaymentDetails = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETDISPLAYMESSAGE, {
        ...headerconfig,
      })
      .then((response) => {
        setMessageData(response.data.data);
      });
  };
  useEffect(() => {
    //GetPaymentDetails();
  }, []);
  useEffect(() => {
    if (localStorage.getItem("userId") !== "") {
      setUserName(localStorage.getItem("name"));
      if (CheckExpirationTime()) {
        auth.uulogin();
      } else {
        navigate("/login");
      }
    }
  }, []);
  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            {/* LOGO */}
            <div className="navbar-brand-box horizontal-logo">
              <b>
                Current Date and Time :{" "}
                {moment(new Date()).format("Do MMM YYYY, h:mm a")}
              </b>
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src="/assets/images/logo-sm.png" alt height={22} />
                </span>
              </Link>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {/* <NotificationsUI></NotificationsUI> */}
            <div className="dropdown ms-sm-3 header-item topbar-user">
              <button
                type="button"
                className="btn"
                id="page-header-user-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="d-flex align-items-center">
                  <img
                    className="rounded-circle header-profile-user"
                    src="/assets/images/default_male_avatar.jpg"
                    alt="Header Avatar"
                  />
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                      {username}
                    </span>
                  </span>
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" to={"/profile"}>
                  <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" />{" "}
                  <span className="align-middle">Profile</span>
                </Link>
                <Link className="dropdown-item" to={"/changepassword"}>
                  <i className="mdi mdi-lock text-muted fs-16 align-middle me-1" />{" "}
                  <span className="align-middle">Change Password</span>
                </Link>
                <Link className="dropdown-item" to={"/logout"}>
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
                  <span className="align-middle" data-key="t-logout">
                    Logout
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {messageData.status == true ? (
          <div className="alert alert-danger">
            Note : {messageData.description}
          </div>
        ) : (
          ""
        )}
      </div>
    </header>
  );
}
