import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import moment from "moment";

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(200);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const GetUserNotifications = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETNOTIFICATIONBYDEVICE +
          "?EndDeviceId=" +
          localStorage.getItem("endDeviceId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setNotifications(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };

  const GetLastPageData = () => {
    GetUserNotifications(totalPages);
  };

  const GetFirstPageData = () => {
    GetUserNotifications("1");
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetUserNotifications(number);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li
        className="page-item"
        key={number}
        id={number}
        onClick={() => GetPageData(number)}
      >
        <Link className="page-link">{number}</Link>
      </li>
    );
  });

  useEffect(() => {
    GetUserNotifications(pageNumber);
  }, []);

  return (
    <div className="mobile-distributer-card">
      <div className="card-body">
        <div className="table-responsive table-card">
          <table
            id="example"
            className="table table-bordered dt-responsive nowrap table-striped align-middle"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th data-ordering="false">Notifications</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 &&
                notifications.map((notification) => (
                  <tr key={notification.notificationId}>
                    <td>
                      <div>{notification.notificationText}</div>
                      <div className="text-muted small">
                        {moment(notification.createdDate).format("DD MMM YYYY")}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
          {/* Hide on small screens */}
          <div className="flex-shrink-0 d-none d-sm-block">
            <div className="text-muted">
              Showing{" "}
              <span className="fw-semibold">{notifications.length}</span> of{" "}
              <span className="fw-semibold">{totalRecords}</span> Results
            </div>
          </div>

          {/* Always show pagination */}
          <ul className="pagination pagination-separated pagination-sm mb-0">
            <li
              className={
                "page-item" + (data.previousPage === null ? " disabled" : "")
              }
              onClick={() => GetFirstPageData()}
            >
              <Link className="page-link">Previous</Link>
            </li>
            {renderPageNumbers}
            <li
              className={
                "page-item" + (data.nextPage === null ? " disabled" : "")
              }
              onClick={() => GetLastPageData()}
            >
              <Link className="page-link">Next</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
