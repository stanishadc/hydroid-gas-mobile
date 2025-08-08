import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { handleSuccess, handleError } from "../Layouts/CustomAlerts";
import moment from "moment";
import APIConfig from "../Configurations/APIConfig";
export default function Notifications() {
  const [notificationUnRead, setNotificationsUnRead] = useState([]);
  const [notificationRead, setNotificationsRead] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const applicationAPI = () => {
    return {
      delete: (id) =>
        axios.delete(
          APIConfig.APIACTIVATEURL + APIConfig.DELETENOTIFICATION + "/" + id, { ...headerconfig }
        ),
    };
  };
  const GetUnReadNotifications = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETNOTIFICATIONUNREAD +"?ToUserId=" + localStorage.getItem("userId"), { ...headerconfig }
      )
      .then((response) => {
        if (response.data.data.succeeded === true) {
          setNotificationsUnRead(response.data.data.data);
          setNotificationCount(response.data.data.data.length);
        }
      });
  };
  const GetReadNotifications = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETNOTIFICATIONREAD +"?ToUserId=" +localStorage.getItem("userId"), { ...headerconfig })
      .then((response) => {
        if (response.data.data.succeeded === true) {
          setNotificationsRead(response.data.data.data);
        }
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?"))
      applicationAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("Notification Deleted Succesfully");
          GetUnReadNotifications();
        });
  };
  useEffect(() => {
    GetUnReadNotifications();
    GetReadNotifications();
  }, []);
  return (
    <div
      className="dropdown topbar-head-dropdown ms-1 header-item"
      id="notificationDropdown"
    >
      <button
        type="button"
        className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
        id="page-header-notifications-dropdown"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="bx bx-bell fs-22" />
        <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
          {notificationCount}
          <span className="visually-hidden">unread messages</span>
        </span>
      </button>
      <div
        className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
        aria-labelledby="page-header-notifications-dropdown"
      >
        <div className="dropdown-head bg-primary bg-pattern rounded-top">
          <div className="p-3">
            <div className="row align-items-center">
              <div className="col">
                <h6 className="m-0 fs-16 fw-semibold text-white">
                  Notifications
                </h6>
              </div>
              <div className="col-auto dropdown-tabs">
                <span className="badge badge-soft-light fs-13">
                  {notificationCount} New
                </span>
              </div>
            </div>
          </div>
          <div className="px-2 pt-2">
            <ul
              className="nav nav-tabs dropdown-tabs nav-tabs-custom"
              data-dropdown-tabs="true"
              id="notificationItemsTab"
              role="tablist"
            >
              <li className="nav-item waves-effect waves-light">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#all-noti-tab"
                  role="tab"
                  aria-selected="true"
                >
                  UNREAD ({notificationCount})
                </a>
              </li>
              <li className="nav-item waves-effect waves-light">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#messages-tab"
                  role="tab"
                  aria-selected="false"
                >
                  READ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="tab-content position-relative"
          id="notificationItemsTabContent"
        >
          <div
            className="tab-pane fade show active py-2 ps-2"
            id="all-noti-tab"
            role="tabpanel"
          >
            <div style={{ maxHeight: 300 }} className="pe-2">
              {notificationUnRead.length > 0 &&
                notificationUnRead.map((notification) => (
                  <div
                    className="text-reset notification-item d-block dropdown-item position-relative"
                    key={notification.notificationId}
                  >
                    <div className="d-flex">
                      <div className="avatar-xs me-3">
                        <span className="avatar-title bg-soft-info text-info rounded-circle fs-16">
                          <i className="bx bx-badge-check" />
                        </span>
                      </div>
                      <div className="flex-1">
                        <Link
                          className="stretched-link"
                          to={"/" + notification.url}
                        >
                          <h6 className="mt-0 mb-2 lh-base">
                            {notification.notificationText}
                          </h6>
                        </Link>
                        <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span>
                            <i className="mdi mdi-clock-outline" />
                            {moment(notification.createdDate)
                              .startOf("hour")
                              .fromNow()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="my-3 text-center view-all">
                <Link
                  to={"/notifications"}
                  type="button"
                  className="btn btn-soft-success waves-effect waves-light"
                >
                  View All Notifications{" "}
                  <i className="ri-arrow-right-line align-middle" />
                </Link>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade py-2 ps-2"
            id="messages-tab"
            role="tabpanel"
            aria-labelledby="messages-tab"
          >
            <div style={{ maxHeight: 300 }} className="pe-2">
              {notificationRead.length > 0 &&
                notificationRead.map((notification) => (
                  <div
                    className="text-reset notification-item d-block dropdown-item position-relative"
                    key={notification.notificationId}
                  >
                    <div className="d-flex">
                      <div className="avatar-xs me-3">
                        <span className="avatar-title bg-soft-info text-info rounded-circle fs-16">
                          <i className="bx bx-badge-check" />
                        </span>
                      </div>
                      <div className="flex-1">
                        <Link className="stretched-link"
                        to={"/" + notification.url}>
                          <h6 className="mt-0 mb-2 lh-base">
                            {notification.notificationText}
                          </h6>
                        </Link>
                        <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span>
                            <i className="mdi mdi-clock-outline" />
                            {moment(notification.createdDate)
                              .startOf("hour")
                              .fromNow()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="my-3 text-center view-all">
                <Link
                  to={"/notifications"}
                  type="button"
                  className="btn btn-soft-success waves-effect waves-light"
                >
                  View All Notifications{" "}
                  <i className="ri-arrow-right-line align-middle" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
