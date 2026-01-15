import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import api from '../utils/constants';

function Login() {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendURL, setIsLoggedIn, getUserData, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = isCreateAccount ? { name, email, password } : { email, password };
    const endpoint = isCreateAccount ? "/register" : "/login";

    try {
      const response = await api.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (isCreateAccount) {
        toast.success("Account created successfully! Please verify your email.");
        await api.post("/send-otp", { email });
        toast.success("OTP has been sent successfully");
        navigate("/email-verify", { state: { email, password } });
      } else {

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);

        }
        toast.success("Login successful!");
        await getUserData();
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login/Register Error:", error);
      const message =
        error.response?.data?.message ||
        (isCreateAccount ? "Failed to create account. Try again." : "Invalid credentials. Try again.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
    >

      <div style={{ position: "absolute", top: 20, left: 30 }}>
        <Link to="/" className="d-flex align-items-center text-light text-decoration-none">
          {/* <img src="/logo.png" alt="logo" width={32} height={32} /> */}
          <span className="ms-2 fw-bold fs-4">Static Stream Html GateWay</span>
        </Link>
      </div>


      <div className="card p-4 shadow-lg border-0 rounded-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">
          {isCreateAccount ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={onSubmitHandler}>
          {isCreateAccount && (
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isCreateAccount && (
            <div className="d-flex justify-content-between mb-3">
              <Link to="/reset-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>
          )}

          <button className="btn btn-primary w-100 fw-semibold" type="submit" disabled={loading}>
            {loading ? "Loading..." : isCreateAccount ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            {isCreateAccount ? (
              <>
                Already have an account?{" "}
                <span
                  className="text-decoration-underline text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsCreateAccount(false)}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  className="text-decoration-underline text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsCreateAccount(true)}
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
