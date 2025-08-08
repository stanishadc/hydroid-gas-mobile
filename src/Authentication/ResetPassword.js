import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import Select from 'react-select';
const initialFieldValues = {
    userId: "00000000-0000-0000-0000-000000000000",
    password: ""
};
export default function ResetPassword() {
    const [values, setValues] = useState(initialFieldValues);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState('00000000-0000-0000-0000-000000000000');
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
        temp.userId = userId === "00000000-0000-0000-0000-000000000000" ? false : true;
        temp.password = values.name === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addOrEdit();
        }
    };
    const applicationAPI = () => {
        return {
            update: () =>
                axios.post(config.APIACTIVATEURL + config.RESETPASSWORDS+"?UserId="+userId.value+"&Password="+values.password, { ...headerconfig })
        };
    };
    const addOrEdit = () => {
        applicationAPI()
            .update()
            .then((res) => {
                if (res.data.statusCode === 200) {
                    handleSuccess(res.data.data);
                    reset();
                }
                else {
                    handleError(res.data.data);
                }
            });
    };
    const reset = () => {
        setValues(initialFieldValues)
    };
    const applyErrorClass = (field) => field in errors && errors[field] === false ? " form-control-danger" : "";
    
    const GetUsers = () => {
        axios.get(config.APIACTIVATEURL + config.GETALLORGANISATIONUSERS + "?OrganisationId=" + localStorage.getItem('organisationId'), { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode === 200) {
                    setUsers(response.data.data);
                }
            });
    };
    useEffect(() => {
        GetUsers();
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
                                    <h4 className="mb-sm-0">Reset Password</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Reset Password</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                <div className="col-lg-3">
                                            <div className="mb-4">
                                            <label htmlFor="password" className="form-label">User</label>
                                                <Select value={userId} onChange={setUserId} options={users} isSearchable />
                                            </div>
                                        </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">New Password</label>
                                            <input type="text" value={values.password} name="password" onChange={handleInputChange} className={"form-control" + applyErrorClass('password')} placeholder="Password" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                                            <button type="submit" className="btn btn-primary">Change Password</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}