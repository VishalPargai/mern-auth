import React, { useContext } from "react";
import "./Header.css";
import { BsRobot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
const Header = () => {
  const navigate = useNavigate();

  const { userData } = useContext(AppContent);
  return (
    <div className="Header">
      <BsRobot style={{ fontSize: "7.5rem", paddingBottom: "6px" }} />
      <h2>Hey {userData ? userData.name : " Developer"}!👋🏻 </h2>
      <h1>Welcome to My App</h1>
      <p>
        Let's start with a quick tour and we will have you up and running in no
        time!
      </p>
      <button className="header-btn" onClick={() => navigate("/login")}>
        Get Started
      </button>
    </div>
  );
};

export default Header;
