import { createContext, useEffect, useState } from 'react';
import api from '../utils/constants';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const response = await api.get("/profile", { withCredentials: true });
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (err) {
      if (isLoggedIn) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const getAuthState = async () => {
    try {
      const response = await api.get("/is-authenticated", { withCredentials: true });
      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  };

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
};
