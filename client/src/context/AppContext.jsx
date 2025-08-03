import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// Enable sending cookies with every request globally
axios.defaults.withCredentials = true;

// Create React Context to share auth and user info
export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // Backend URL from environment variables (make sure it's set)
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // State to track if user is logged in
  const [isLoggedin, setIsLoggedin] = useState(false);

  // State to hold user data object after login
  const [userData, setUserData] = useState(null);

  // Function to check if user is authenticated (session valid)
  const getAuthState = async () => {
    try {
      // Call your backend auth API
      const { data } = await axios.get(backendurl + "/api/auth/is-auth");

      if (data.success) {
        // If valid session, set logged in state and fetch user data
        setIsLoggedin(true);
        getUserData();
      } else {
        // Otherwise, treat as logged out
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      // Show error message and treat as logged out
      toast.error(error.message);
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  // Function to fetch user data
  const getUserData = async () => {
    try {
      // Call your backend to get user info
      const { data } = await axios.get(backendurl + "/api/user/data");

      if (data.success) {
        // Save user data to state
        setUserData(data.userData);
      } else {
        toast.error(data.message);
        setUserData(null);
      }
    } catch (error) {
      toast.error(error.message);
      setUserData(null);
    }
  };

  // On component mount (once), check auth status
  useEffect(() => {
    getAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Context value to pass down to children
  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
