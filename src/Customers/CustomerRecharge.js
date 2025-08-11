import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import moment from "moment";

export default function CustomerRecharge(refreshKey) {
  const [lists, setLists] = useState({});
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

  const GetUserData = () => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETUSERRECHARGEBYID +
          "?UserId=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setLists(response.data.data.data);
          setPageNumber(response.data.data.pageNumber);
          setPageSize(response.data.data.pageSize);
          setTotalPages(response.data.data.totalPages);
          setData(response.data.data);
          setTotalRecords(response.data.data.totalRecords);
        }
      });
  };

  const GetLastPageData = () => {
    GetUserData(totalPages);
  };

  const GetFirstPageData = () => {
    GetUserData("1");
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetUserData(number);
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
    GetUserData(pageNumber);
  }, [refreshKey]);

  return (
    <div className="card-body">
      <div className="recharge-history mb-3">
        <h5>Recent Recharges</h5>
        <div className="table-responsive table-card mt-2">
          <table className="table table-bordered dt-responsive nowrap table-striped align-middle">
            <thead>
              <tr>
                <th>Recharge Details</th>
              </tr>
            </thead>
            <tbody>
              {lists.length > 0 &&
                lists.map((r) => (
                  <tr key={r.rechargeId}>
                    <td>
                      <div className="d-flex flex-column">
                        <div className="mb-1">
                          <strong>Quantity:</strong> {r.quantity} Kgs
                        </div>
                        <div className="mb-1">
                          <strong>Amount:</strong> {r.amount} INR
                        </div>
                        <div className="mb-1">
                          <strong>Price Per Kg:</strong> {r.pricePerKg}
                        </div>
                        <div className="mb-1">
                          <strong>Date:</strong>{" "}
                          {moment(r.createdDate).format("DD MMM YYYY hh:mm a")}
                        </div>
                        <div className="mb-1">
                          <strong>Recharge Status:</strong>{" "}
                          {r.rechargeStatus === "Processing" ? (
                            <span className="badge bg-warning">PROCESSING</span>
                          ) : r.rechargeStatus === "COMPLETED" ? (
                            <span className="badge bg-success">COMPLETED</span>
                          ) : (
                            <span className="badge bg-info">
                              {r.rechargeStatus}
                            </span>
                          )}
                        </div>
                        <div>
                          <strong>Payment Status:</strong>{" "}
                          {r.paymentStatus === "SUCCESS" ? (
                            <span className="badge bg-success">SUCCESS</span>
                          ) : (
                            <span className="badge bg-warning">
                              {r.paymentStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
          {/* Hidden on mobile */}
          <div className="flex-shrink-0 d-none d-sm-block">
            <div className="text-muted">
              Showing <span className="fw-semibold">{lists.length}</span> of{" "}
              <span className="fw-semibold">{totalRecords}</span> Results
            </div>
          </div>
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
