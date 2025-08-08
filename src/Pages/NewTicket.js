import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { TicketStatus, TicketPriority } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
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
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken")
        }
    }
    const validate = () => {
        let temp = {};
        temp.ticketCategoryId = values.ticketCategoryId === "00000000-0000-0000-0000-000000000000" ? false : true;
        temp.ticketQuery = values.ticketQuery === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = new FormData()
            formData.append("ticketId", values.ticketId);
            formData.append("ticketQuery", values.ticketQuery);
            formData.append("ticketStatus", values.ticketStatus);
            formData.append("ticketCategoryId", values.ticketCategoryId);
            formData.append("ticketPriority", values.ticketPriority);
            formData.append("organisationId", localStorage.getItem("organisationId"));
            formData.append("userId", localStorage.getItem("userId"));
            formData.append("imageFile", values.imageFile);
            addOrEdit(formData);
            //console.log(values.imageFile);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.CREATETICKET, newrecord, { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(config.APIACTIVATEURL + config.UPDATETICKET, updateRecord),
            delete: (id) => axios.delete(config.APIACTIVATEURL + config.DELETETICKET + "/" + id, { ...headerconfig })
        };
    };
    const showPreview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: ""
            })
        }
    }
    const addOrEdit = (formData) => {
        if (formData.get("ticketId") === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.data);
                        resetForm();
                        GetTickets("1");
                    }
                    else {
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
                    }
                    else {
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
            .get(config.APIACTIVATEURL + config.GETALLTICKETCATEGORIES, { ...headerconfig })
            .then((response) => {
                setTicketCategory(response.data.data.data);
            });
    };
    const GetTickets = (number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETTICKETBYUSER + "?UserId=" + localStorage.getItem("userId") + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
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
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Ticket Deleted Succesfully");
                    GetTickets("1");
                })
    }
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    const GetLastPageData = () => {
        GetTickets(totalPages)
    }
    const GetFirstPageData = () => {
        GetTickets("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetTickets(number)
    }
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map((number) => {
        return (
            <li className="page-item" key={number} id={number} onClick={() => GetPageData(number)}>
                <Link className="page-link">{number}</Link>
            </li>
        );
    });
    useEffect(() => {
        GetTicketCategories();
        GetTickets(pageNumber);
    }, [])
    return (
        <div className="card align-items-start">
            <div className="row">
                <div className="col-12">
                    <h4 className="p-2">Tickets</h4>
                </div>
                <div className="col-12">
                    <div className="alert alert-success">
                        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="mb-4">
                                        <label htmlFor="ticketCategoryId" className="form-label">Category</label>
                                        <select name="ticketCategoryId" value={values.ticketCategoryId} onChange={handleInputChange} className={"form-select" + applyErrorClass('ticketCategoryId')}>
                                            <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                            {ticketCategory.length > 0 && ticketCategory.map(tc =>
                                                <option value={tc.ticketCategoryId}>{tc.ticketCategoryName}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="mb-4">
                                        <label htmlFor="ticketPriority" className="form-label">Priority</label>
                                        <select name="ticketPriority" value={values.ticketPriority} onChange={handleInputChange} className={"form-select" + applyErrorClass('ticketPriority')}>
                                            <option value={TicketPriority.LOW}>{TicketPriority.LOW}</option>
                                            <option value={TicketPriority.MEDIUM}>{TicketPriority.MEDIUM}</option>
                                            <option value={TicketPriority.HIGH}>{TicketPriority.HIGH}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <label htmlFor="ticketQuery" className="form-label">Query</label>
                                        <textarea type="text" value={values.ticketQuery} name="ticketQuery" onChange={handleInputChange} className={"form-control" + applyErrorClass('ticketQuery')} placeholder="Ticket Query" />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <input id="image-uploader" name="imageSrc" className={"form-control-file" + applyErrorClass('imageSrc')} type="file" onChange={showPreview} />
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                        <button type="button" className="btn btn-danger" onClick={resetForm}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-12">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Tickets List</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive table-card">
                                <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th data-ordering="false">ID</th>
                                            <th data-ordering="false">TicketNo</th>
                                            <th data-ordering="false">Category</th>
                                            <th data-ordering="false">Query</th>
                                            <th data-ordering="false">Priority</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 && tickets.map((ticket, index) =>
                                            <tr key={ticket.ticketId}>
                                                <td>{index + 1}</td>
                                                <td>{ticket.ticketNo}</td>
                                                <td>{ticket.ticketCategoryName}</td>
                                                <td>{ticket.ticketQuery}</td>
                                                <td>
                                                    {ticket.ticketStatus === TicketStatus.OPEN ? <span className="badge bg-success">{TicketStatus.OPEN}</span> : <span className="badge bg-warning">{TicketStatus.PENDING}</span>}
                                                </td>
                                                <td>
                                                    {ticket.ticketPriority === TicketPriority.LOW ? <span className="badge bg-success">{TicketPriority.LOW}</span> : ticket.ticketPriority === TicketPriority.MEDIUM ? <span className="badge bg-warning">{TicketPriority.MEDIUM}</span> : <span className="badge bg-danger">{TicketPriority.HIGH}</span>}
                                                </td>
                                                <td>
                                                    <div class="hstack gap-3 flex-wrap">
                                                        <Link to={"/ticketdetails/" + ticket.ticketId} class="link-success fs-15"><i class="ri-eye-2-line"></i></Link>
                                                        <Link onClick={() => { showEditDetails(ticket); }} class="link-success fs-15"><i class="ri-edit-2-line"></i></Link>
                                                        <Link onClick={e => onDelete(e, ticket.ticketId)} class="link-danger fs-15"><i class="ri-delete-bin-line"></i></Link>
                                                    </div>

                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                                <div className="flex-shrink-0">
                                    <div className="text-muted">
                                        Showing <span className="fw-semibold">{tickets.length}</span> of <span className="fw-semibold">{totalRecords}</span> Results
                                    </div>
                                </div>
                                <ul className="pagination pagination-separated pagination-sm mb-0">
                                    <li className={"page-item" + data.previousPage === null ? 'disabled' : ''} onClick={() => GetFirstPageData()}>
                                        <Link className="page-link">Previous</Link>
                                    </li>
                                    {renderPageNumbers}
                                    <li className={"page-item" + data.nextPage === null ? 'disabled' : ''} onClick={() => GetLastPageData()}>
                                        <Link className="page-link">Next</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                </div>{/*end col*/}
            </div>
        </div>
    );
}