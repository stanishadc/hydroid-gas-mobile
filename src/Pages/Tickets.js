import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { TicketStatus, TicketPriority } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import moment from "moment";
const initialFieldValues = {
    id: 0,
    deviceId: "",
    applicationId: "",
    userId: localStorage.getItem("userId"),
    status: true    
};
export default function Tickets() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [dateSorting, setDateSorting] = useState("DESC");
    const [priority, setPriority] = useState("HIGH");
    const [status, setStatus] = useState("OPEN");
    const [errors, setErrors] = useState({});
    const [tickets, setTickets] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const statusvalues = [
        { label: 'Active', value: true },
        { label: 'InActive', value: false }
    ]
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
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const validate = () => {
        let temp = {};
        temp.deviceId = values.deviceId === "" ? false : true;
        temp.applicationId = values.applicationId === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };    

    const resetForm = () => {
        setValues(initialFieldValues);
    };
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const GetTickets = (number) => {
        var sortingData = {
            "dateAsc": dateSorting
        }
        axios
            .get(config.APIACTIVATEURL + config.GETALLTICKETS + "?dateAsc=" + dateSorting + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                setTickets(response.data.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };
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
    const handleSearch = (e) => {
        e.preventDefault();
        GetTickets(pageNumber);
    };
    useEffect(() => {
        GetTickets(pageNumber);
    }, [])
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
                                    <h4 className="mb-sm-0">Tickets</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Tickets</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Tickets List</h5>
                                    </div>
                                    <div className="row g-3 p-3">
                                        <div className="col-md-3">
                                            <select value={dateSorting} onChange={e => setDateSorting(e.target.value)} placeholder="dateSorting" name="dateSorting" className={"form-select"}>
                                                <option value="ASC">Date ASCENDING</option>
                                                <option value="DESC">Date DESCENDING</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3 d-flex">
                                            {
                                                loading === true ?
                                                    <div className="flex-shrink-0">
                                                        <button disabled type="button" className="btn btn-success mr-2"><i className="ri-search-line align-middle me-1" /> Please wait...</button>
                                                    </div>
                                                    :
                                                    <div className="flex-shrink-0">
                                                        <button onClick={(e) => handleSearch(e)} type="button" className="btn btn-success mr-2"><i className="ri-search-line align-middle me-1" /> Search</button>
                                                    </div>

                                            }
                                            <div className="flex-shrink-0 ms-2">
                                                <button onClick={resetForm} type="button" className="btn btn-danger"><i className="ri-search-line align-middle me-1" /> Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">ID</th>
                                                        <th data-ordering="false">Date</th>
                                                        <th data-ordering="false">TicketNo</th>
                                                        <th data-ordering="false">Category</th>
                                                        <th data-ordering="false">Name</th>
                                                        <th data-ordering="false">Query</th>
                                                        <th data-ordering="false">Priority</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tickets.length > 0 && tickets.map((ticket, index) =>
                                                        <tr key={ticket.ticketId}>
                                                            <td>{((pageNumber - 1) * 10) + index + 1}</td>
                                                            <td>{moment(ticket.createdDate).format('Do MMM YYYY, h:mm a')}</td>
                                                            <td>{ticket.ticketNo}</td>
                                                            <td>{ticket.ticketCategoryName}</td>
                                                            <td>{ticket.userName}</td>
                                                            <td>{ticket.ticketQuery}</td>
                                                            <td>
                                                                {ticket.ticketPriority === TicketPriority.LOW ? <span className="badge bg-success">{TicketPriority.LOW}</span> : ticket.ticketPriority === TicketPriority.MEDIUM ? <span className="badge bg-warning">{TicketPriority.MEDIUM}</span> : <span className="badge bg-danger">{TicketPriority.HIGH}</span>}
                                                            </td>
                                                            <td>
                                                                {ticket.ticketStatus === TicketStatus.OPEN ? <span className="badge bg-success">{TicketStatus.OPEN}</span> : <span className="badge bg-warning">{ticket.ticketStatus}</span>}
                                                            </td>
                                                            <td>
                                                                <div class="hstack gap-3 flex-wrap">
                                                                    <Link to={"/ticketdetails/" + ticket.ticketId} class="link-success fs-15"><i class="ri-eye-2-line"></i></Link>
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
                                </div>
                            </div>{/*end col*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}