import React, { useContext, useState } from "react";
import { FaAutoprefixer } from "react-icons/fa";
import { CiUser, CiMail, CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const Navigate = useNavigate();

  const { backendurl, setIsLoggedin, getUserData } = useContext(AppContent);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true; //with this it will send cookies also with the req
      if (state === "Sign Up") {
        const { data } = await axios.post(backendurl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          Navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendurl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          Navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="container">
      <nav className="navbar">
        <FaAutoprefixer className="logo" onClick={() => Navigate("/")} />
      </nav>
      <div className="form-box">
        <h2>{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p className="subtitle">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        {/* form starts from here */}
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="input-icon-wrapper">
              <CiUser className="input-icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="input-icon-wrapper">
            <CiMail className="input-icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email id"
              required
            />
          </div>
          
          <div className="input-icon-wrapper">
            <CiLock className="input-icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <a className="forgot" onClick={() => Navigate("/reset-password")}>
            Forgot password?
          </a>
          <button className="signup-btn">
            {state === "Sign Up" ? "Sign Up" : "Login"}
          </button>
        </form>
        {state === "Sign Up" ? (
          <div className="footer-text">
            Already have an account?{" "}
            <a onClick={() => setState("Login")}>Login here</a>
          </div>
        ) : (
          <div className="footer-text">
            Don&apos;t have an account?{" "}
            <a onClick={() => setState("Sign Up")}>Sign up</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
