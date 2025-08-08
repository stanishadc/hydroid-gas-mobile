import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import auth from "../Common/Configurations/Auth";
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    auth.ulogout(() => {
      navigate("/");
    });
  }, []);
  return (
    <div className="auth-page-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <a href="index.html" className="d-inline-block auth-logo">
                  <img src="/assets/images/logo-light.png" alt height={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* end row */}
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card mt-4">
              <div className="card-body p-4 text-center">
                <lord-icon
                  src="https://cdn.lordicon.com/hzomhqxz.json"
                  trigger="loop"
                  colors="primary:#405189,secondary:#08a88a"
                  style={{ width: 180, height: 180 }}
                />
                <div className="mt-4 pt-2">
                  <h5>You are Logged Out</h5>
                  <p className="text-muted">
                    Thank you for using{" "}
                    <span className="fw-semibold">velzon</span> admin template
                  </p>
                  <div className="mt-4">
                    <Link to={"/login"} className="btn btn-success w-100">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
              {/* end card body */}
            </div>
            {/* end card */}
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}
    </div>
  );
}
