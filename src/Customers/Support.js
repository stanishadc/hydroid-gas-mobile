import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import ValveSwitch from "./ValveComponent";
import NewsMarquee from "../Customers/NewsMarquee";
import NewTicket from "../Pages/NewTicket";
import CustomerDistributer from "./CustomerDistributer";
import ValveComponent from "./ValveComponent";
export default function Support() {
  return (
    <div id="layout-wrapper">
      <Header />
      <SideBar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-12">
                <NewsMarquee />
              </div>
            </div>
            <div className="row mb-2">
              <CustomerDistributer></CustomerDistributer>
              <ValveComponent></ValveComponent>
            </div>
            <NewTicket></NewTicket>
          </div>
        </div>
      </div>
    </div>
  );
}
