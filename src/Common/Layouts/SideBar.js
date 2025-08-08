import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="app-menu navbar-menu">
      {/* LOGO */}
      <div className="navbar-brand-box">
        {/* Dark Logo*/}
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt height={22} />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-dark.png" alt height={17} />
          </span>
        </Link>
        {/* Light Logo*/}
        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt height={22} />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-light.png" alt height={17} />
          </span>
        </Link>
        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line" />
        </button>
      </div>
      <div id="scrollbar">
        <div className="container-fluid">
          <div id="two-column-menu"></div>
          {localStorage.getItem("roleName") === "CUSTOMER" ? (
            <ul className="navbar-nav" id="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/customer/dashboard"}>
                  <i className="ri-dashboard-fill" />{" "}
                  <span data-key="t-dashboards">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/recharge"}>
                  <i className="ri-money-dollar-box-line" />{" "}
                  <span data-key="t-dashboards">Recharge</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/support"}>
                  <i className="ri-ticket-fill" />{" "}
                  <span data-key="t-dashboards">Support</span>
                </Link>
              </li>
            </ul>
          ) : localStorage.getItem("roleName") === "SUPERADMIN" ? (
            <ul className="navbar-nav" id="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link menu-link"
                  to={"/superadmin/dashboard"}
                >
                  <i className="ri-dashboard-fill" />{" "}
                  <span data-key="t-dashboards">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/devices"}>
                  <i className="ri-tv-2-line" />{" "}
                  <span data-key="t-dashboards">Devices</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/users"}>
                  <i className="ri-folder-user-fill" />{" "}
                  <span data-key="t-dashboards">Users</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/gasprice"}>
                  <i className="ri-money-dollar-box-line" />{" "}
                  <span data-key="t-dashboards">Gas Price</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/news"}>
                  <i className="ri-notification-2-fill" />{" "}
                  <span data-key="t-dashboards">News</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/tickets"}>
                  <i className="ri-ticket-fill" />{" "}
                  <span data-key="t-dashboards">Tickets</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/rechargestatus"}>
                  <i className="ri-money-dollar-box-line" />{" "}
                  <span data-key="t-dashboards">Gas Recharges</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/notifications"}>
                  <i className="ri-notification-2-fill" />{" "}
                  <span data-key="t-dashboards">Notifications</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link" to={"/gasdistributers"}>
                  <i className="ri-folder-user-fill" />{" "}
                  <span data-key="t-dashboards">Distributers</span>
                </Link>
              </li>
            </ul>
          ) : (
            ''
          )}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
