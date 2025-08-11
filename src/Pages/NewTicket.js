import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import { TicketStatus, TicketPriority } from "../Common/Enums";
import "./MobileNewTicket.css";

const initialFieldValues = {
  ticketId: "00000000-0000-0000-0000-000000000000",
  ticketCategoryId: "00000000-0000-0000-0000-000000000000",
  ticketQuery: "",
  ticketStatus: TicketStatus.OPEN,
  ticketPriority: TicketPriority.LOW,
  userId: "00000000-0000-0000-0000-000000000000",
  organisationId: "00000000-0000-0000-0000-000000000000",
  imageFile: null,
  imageSrc: "",
};

export default function NewTicket() {
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [ticketCategory, setTicketCategory] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
    },
  };

  useEffect(() => {
    if (recordForEdit !== null) setValues(recordForEdit);
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = () => {
    let temp = {};
    temp.ticketCategoryId =
      values.ticketCategoryId === "00000000-0000-0000-0000-000000000000"
        ? false
        : true;
    temp.ticketQuery = values.ticketQuery === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("ticketId", values.ticketId);
      formData.append("ticketQuery", values.ticketQuery);
      formData.append("ticketStatus", values.ticketStatus);
      formData.append("ticketCategoryId", values.ticketCategoryId);
      formData.append("ticketPriority", values.ticketPriority);
      formData.append("organisationId", localStorage.getItem("organisationId"));
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("imageFile", values.imageFile);
      addOrEdit(formData);
    }
  };

  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(config.APIACTIVATEURL + config.CREATETICKET, newrecord, {
          ...headerconfig,
        }),
      update: (updateRecord) =>
        axios.put(config.APIACTIVATEURL + config.UPDATETICKET, updateRecord),
      delete: (id) =>
        axios.delete(config.APIACTIVATEURL + config.DELETETICKET + "/" + id, {
          ...headerconfig,
        }),
    };
  };

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValues({
          ...values,
          imageFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValues({
        ...values,
        imageFile: null,
        imageSrc: "",
      });
    }
  };

  const addOrEdit = (formData) => {
    if (formData.get("ticketId") === "00000000-0000-0000-0000-000000000000") {
      applicationAPI()
        .create(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetTickets("1");
          } else {
            handleError(res.data.message);
          }
        });
    } else {
      applicationAPI()
        .update(formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess(res.data.data);
            resetForm();
            GetTickets("1");
          } else {
            handleError(res.data.message);
          }
        });
    }
  };

  const resetForm = () => {
    setValues(initialFieldValues);
  };

  const showEditDetails = (data) => {
    setRecordForEdit(data);
  };

  const GetTicketCategories = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETALLTICKETCATEGORIES, {
        ...headerconfig,
      })
      .then((response) => {
        setTicketCategory(response.data.data.data);
      });
  };

  const GetTickets = (number) => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETTICKETBYUSER +
          "?UserId=" +
          localStorage.getItem("userId") +
          "&pageNumber=" +
          number +
          "&pageSize=" +
          pageSize +
          "",
        { ...headerconfig }
      )
      .then((response) => {
        setTickets(response.data.data.data);
        setPageNumber(response.data.data.pageNumber);
        setPageSize(response.data.data.pageSize);
        setTotalPages(response.data.data.totalPages);
        setData(response.data.data);
        setTotalRecords(response.data.data.totalRecords);
      });
  };

  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      applicationAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("Ticket Deleted Succesfully");
          GetTickets("1");
        });
    }
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";

  const GetLastPageData = () => {
    GetTickets(totalPages);
  };

  const GetFirstPageData = () => {
    GetTickets("1");
  };

  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) {
      GetTickets(number);
    }
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
    GetTicketCategories();
    GetTickets(pageNumber);
  }, []);

  return (
    <div className="mobile-ticket-container">
      <h4 className="ticket-title">Tickets</h4>

      <div className="ticket-form">
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="form-group">
            <label htmlFor="ticketCategoryId">Category</label>
            <select
              name="ticketCategoryId"
              value={values.ticketCategoryId}
              onChange={handleInputChange}
              className={"form-select" + applyErrorClass("ticketCategoryId")}
            >
              <option value="00000000-0000-0000-0000-000000000000">
                Please Select
              </option>
              {ticketCategory.length > 0 &&
                ticketCategory.map((tc) => (
                  <option key={tc.ticketCategoryId} value={tc.ticketCategoryId}>
                    {tc.ticketCategoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ticketPriority">Priority</label>
            <select
              name="ticketPriority"
              value={values.ticketPriority}
              onChange={handleInputChange}
              className={"form-select" + applyErrorClass("ticketPriority")}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ticketQuery">Query</label>
            <textarea
              type="text"
              value={values.ticketQuery}
              name="ticketQuery"
              onChange={handleInputChange}
              className={"form-control" + applyErrorClass("ticketQuery")}
              placeholder="Ticket Query"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Attachment</label>
            <input
              id="image-uploader"
              name="imageSrc"
              className={"form-control-file" + applyErrorClass("imageSrc")}
              type="file"
              onChange={showPreview}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Submit
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="ticket-list">
        <h5 className="list-title">Tickets List</h5>

        <div className="table-responsive">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>TicketNo</th>
                <th>Category</th>
                <th>Query</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 &&
                tickets.map((ticket, index) => (
                  <tr key={ticket.ticketId}>
                    <td>{ticket.ticketNo}</td>
                    <td>{ticket.ticketCategoryName}</td>
                    <td>{ticket.ticketQuery}</td>
                    <td>
                      {ticket.ticketPriority === "LOW" ? (
                        <span className="badge bg-success">LOW</span>
                      ) : ticket.ticketPriority === "MEDIUM" ? (
                        <span className="badge bg-warning">MEDIUM</span>
                      ) : (
                        <span className="badge bg-danger">HIGH</span>
                      )}
                    </td>
                    <td>
                      {ticket.ticketStatus === "OPEN" ? (
                        <span className="badge bg-success">OPEN</span>
                      ) : (
                        <span className="badge bg-warning">PENDING</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={"/ticketdetails/" + ticket.ticketId}
                          className="btn-view"
                        >
                          <i className="ri-eye-2-line"></i>
                        </Link>
                        <Link
                          onClick={() => {
                            showEditDetails(ticket);
                          }}
                          className="btn-edit"
                        >
                          <i className="ri-edit-2-line"></i>
                        </Link>
                        <Link
                          onClick={(e) => onDelete(e, ticket.ticketId)}
                          className="btn-delete"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">
            Showing <span>{tickets.length}</span> of <span>{totalRecords}</span>{" "}
            Results
          </div>
          <ul className="pagination">
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
