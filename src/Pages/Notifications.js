import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";
import APIConfig from "../Common/Configurations/APIConfig";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
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
          config.APIACTIVATEURL + config.DELETENOTIFICATION + "/" + id,
          { ...headerconfig }
        ),
    };
  };
  const GetNotifications = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETALLNOTIFICATIONS,
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.data.succeeded === true) {
          setNotifications(response.data.data.data);
        }
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?"))
      applicationAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("Notification Deleted Succesfully");
          GetNotifications();
        });
  };
  useEffect(() => {
    GetNotifications();
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
                  <h4 className="mb-sm-0">Notifications</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Notifications</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Notifications List</h5>
                  </div>
                  <div className="card-body">
                    <table
                      id="example"
                      className="table table-bordered dt-responsive nowrap table-striped align-middle"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th data-ordering="false">Notification</th>
                          <th data-ordering="false">Notification Type</th>
                          <th data-ordering="false">Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notifications.length > 0 &&
                          notifications.map((notification) => (
                            <tr key={notification.notificationId}>
                              <td>{notification.notificationText}</td>
                              <td>{notification.type}</td>
                              <td>
                                {moment(notification.createdDate).format(
                                  "MMM Do YYYY, h:mm a"
                                )}
                              </td>
                              <td>
                                {notification.status === true ? (
                                  <span className="badge bg-success">
                                    {UserStatus.ACTIVE}
                                  </span>
                                ) : (
                                  <span className="badge bg-warning">
                                    {UserStatus.INACTIVE}
                                  </span>
                                )}
                              </td>
                              <td>
                                <div class="hstack gap-3 flex-wrap">
                                  <Link
                                    to={"/" + notification.url}
                                    class="link-success fs-15"
                                  >
                                    <i class="ri-eye-2-line"></i>
                                  </Link>
                                  <Link
                                    className="dropdown-item remove-item-btn"
                                    onClick={(e) =>
                                      onDelete(e, notification.notificationId)
                                    }
                                  >
                                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/*end col*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
