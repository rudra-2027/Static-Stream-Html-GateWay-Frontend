import React, { useContext, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../utils/constants';

// import logo from '../assets/logo.png'; // make sure you have this image

function ResetPassword() {
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("")
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  // const { backendURL } = useContext(AppContext);

  axios.defaults.withCredentials = true;


  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/send-reset-otp?email=" + email);
      if (response.status === 200) {
        toast.success('OTP sent to your email');
        setIsEmailSent(true);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = inputRef.current.map((input) => input?.value || '').join('');
    setOtp(otp)
    if (otp.length !== 6) {
      toast.error('Please enter all 6 digits of OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/verify-otp", { email, otp });
      if (response.status === 200) {
        toast.success('OTP verified successfully');
        setIsOtpVerified(true);
      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/reset-password", { email, otp, newPassword });
      if (response.status === 200) {
        toast.success('Password reset successfully');
        navigate('/login');
      } else {
        toast.error('Failed to reset password');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong while resetting password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '');
    e.target.value = value;
    if (value && index < 5) inputRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
    paste.forEach((digit, i) => {
      if (inputRef.current[i]) inputRef.current[i].value = digit;
    });
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next]?.focus();
  };


  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        background: 'linear-gradient(90deg,#6a5af9,#8268f9)',
        border: 'none',
      }}
    >
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src="{logo}" alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>


      {!isEmailSent && (
        <div
          className="rounded-4 p-5 text-center bg-white shadow"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <h4 className="mb-3 text-dark">Reset Password</h4>
          <p className="mb-4 text-secondary">
            Enter your registered email address to receive a reset OTP.
          </p>
          <form onSubmit={handleSendResetOtp}>
            <div className="input-group mb-4">
              <span className="input-group-text bg-light border-0 ps-4">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-0 ps-1 pe-4 rounded-end"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      )}


      {isEmailSent && !isOtpVerified && (
        <div className="p-5 rounded-4 shadow bg-white text-center" style={{ width: '400px' }}>
          <h4 className="fw-bold mb-2">Verify OTP</h4>
          <p className="text-black-50 mb-4">Enter the 6-digit code sent to your email.</p>

          <div className="d-flex justify-content-between gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="form-control text-center fs-4 otp-input"
                ref={(el) => (inputRef.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
            onClick={handleVerifyOtp}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {isOtpVerified && (
        <div
          className="rounded-4 p-5 text-center bg-white shadow"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <h4 className="mb-3 text-dark">Set New Password</h4>
          <p className="mb-4 text-secondary">Enter your new password below.</p>
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="***********"
                style={{ height: '50px' }}
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
