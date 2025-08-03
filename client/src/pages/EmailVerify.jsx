import React, { useContext, useEffect } from "react";
import { FaAutoprefixer } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmailVerify.css";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendurl, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  //func for auto frd space while typing
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  //func for backspace
  const handleBackSpace = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  //func for Paste OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSumbitHandler = async (e) => {
    try {
      e.preventDefault();
      const otArray = inputRefs.current.map((e) => e.value);
      const otp = otArray.join("");

      const { data } = await axios.post(
        backendurl + "/api/auth/verify-account",
        {
          otp,
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="main-div">
      <nav className="navbar">
        <FaAutoprefixer className="logo" onClick={() => navigate("/")} />
      </nav>
      <div className="verify-box">
        <h2>Email Verify OTP</h2>
        <p className="subtext">Enter the 6-digit code sent to your email id.</p>
        <form className="otp-form" onSubmit={onSumbitHandler}>
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
          <button className="verify-btn">Verify email</button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
