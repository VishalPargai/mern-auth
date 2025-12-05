import React, { useContext, useState } from "react";
import { FaAutoprefixer } from "react-icons/fa";
import { CiMail, CiLock } from "react-icons/ci";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendurl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Changed from "" to false for correct rendering logic
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  // func for auto focus while typing
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // func for backspace focus shift
  const handleBackSpace = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // func for Paste OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // for submitting email (1st form)
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendurl + "/api/auth/send-reset-otp",
        {
          email,
        }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);

      // Correctly set to boolean true to trigger UI change
      if (data.success) {
        setIsEmailSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // for OTP submission (2nd form)
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  // for submitting new password (3rd form)
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendurl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="Rs-password-div">
      <nav className="navbar">
        <FaAutoprefixer className="logo" onClick={() => navigate("/")} />
      </nav>

      {/* Reset password form */}
      {!isEmailSent && (
        <div className="form-box-Rs">
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your registered email address</p>

          <form onSubmit={onSubmitEmail}>
            <div className="input-icon-wrapper">
              <CiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="signup-btn">Send OTP</button>
          </form>
        </div>
      )}

      {/* OTP Enter FORM */}
      {!isOtpSubmitted && isEmailSent && (
        <div className="verify-box">
          <h2>Reset password OTP</h2>
          <p className="subtext">
            Enter the 6-digit code sent to your email id.
          </p>
          <form className="otp-form" onSubmit={onSubmitOTP}>
            <div className="otp-input-group" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    className="otp-input"
                    type="text"
                    maxLength={1}
                    key={index}
                    required
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleBackSpace(e, index)}
                  />
                ))}
            </div>
            <button className="verify-btn">Submit</button>
          </form>
        </div>
      )}

      {/* Enter New password */}
      {isOtpSubmitted && isEmailSent && (
        <div className="form-box-Rs">
          <h2>New Password</h2>
          <p className="subtitle">Enter your New password</p>

          <form onSubmit={onSubmitNewPassword}>
            <div className="input-icon-wrapper">
              <CiLock className="input-icon" />
              <input
                type="text" // optionally you can change this to "password" for hidden input
                placeholder="Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button className="signup-btn">Change Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
