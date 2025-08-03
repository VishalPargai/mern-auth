import React, { useContext, useState } from "react";
import { FaAutoprefixer } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import { MdMarkEmailRead } from "react-icons/md";
import "./Navbar.css";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { userData, backendurl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendurl + "/api/auth/send-verify-otp"
      );

      if(data.success){
        navigate("/email-verify")
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendurl + "/api/auth/logout");

      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="Nav">
      <div>
        <FaAutoprefixer style={{ fontSize: "3rem" }} />
      </div>
      {userData ? (
        <div className="user-logo" onClick={() => setClick(!click)}>
          {userData.name[0].toUpperCase()}
          <div className="verify">
            <ul>
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp}>
                  Verify Email
                  <MdMarkEmailRead />
                </li>
              )}

              <li onClick={logout}>
                Logout
                <SlLogout />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate("/login")}>
          Login <FaLongArrowAltRight className="icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
