import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import api from '../utils/constants';
import axios from 'axios';


function MenuBar() {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn } = useContext(AppContext);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOnClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOnClick);
    return () => document.removeEventListener("mousedown", handleOnClick);
  }, []);

  // const handleLogout = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8080/api/v1.0/logout",

  //       // { withCredentials: true }
  //     );

  //     localStorage.removeItem("token");
  //     delete api.defaults.headers.common["Authorization"];
  //     setIsLoggedIn(false);
  //     setUserData(null);
  //     toast.success("Logged out successfully");
  //     navigate("/login");

  //     console.log(res.status);
  //   } catch (err) {
  //     console.warn("Backend logout failed (maybe no token) — continuing anyway");
  //   }
  // };
  const handleLogout = async () => {
    try {

      const res = await axios.post(
        "http://localhost:8080/api/v1.0/logout",
        {},
        {
          withCredentials: true,
          headers: {

            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
        }
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("Logged out successfully");
      } else {
        toast.info("Logout request sent; session may have already expired");
      }
    } catch (err) {
      console.warn(
        "Backend logout failed (maybe no session or token) — continuing anyway",
        err
      );
      toast.info("Logging out locally anyway");
    } finally {

      localStorage.removeItem("token");
      if (api.defaults.headers.common["Authorization"])
        delete api.defaults.headers.common["Authorization"];

      setIsLoggedIn(false);
      setUserData(null);


      navigate("/login");
    }
  };


  const sendVerificationOtp = async () => {
    try {
      const response = await api.post("/send-otp", { email: userData?.email });
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has been sent successfully");
      } else {
        toast.error("Unable to send OTP");
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || "Failed to send verification OTP.";
      toast.error(errorMsg);
      console.error("OTP send error:", err);
    }
  };

  return (
    <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        {/* <img src="logo192.png" alt="logo" width={32} height={32} /> */}
        <span className="fw-bold fs-4 text-dark">Static Stream Html GateWay</span>
      </div>

      {userData ? (
        <div className="position-relative" ref={dropdownRef}>
          <div
            className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setDropDownOpen((prev) => !prev)}
          >
            {userData.name[0].toUpperCase()}
          </div>
          {dropdownOpen && (
            <div
              className="position-absolute shadow bg-white rounded p-2"
              style={{
                top: "50px",
                right: "0px",
                zIndex: 100,
              }}
            >
              {!userData.isAccountVerified && (
                <div
                  className="dropdown-item py-1 px-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={sendVerificationOtp}
                >
                  Verify email
                </div>
              )}
              <div
                className="dropdown-item py-1 px-2 text-danger"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="btn btn-outline-dark round-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login <i className="bi bi-arrow-right ms-2"></i>
        </div>
      )}
    </nav>
  );
}

export default MenuBar;
