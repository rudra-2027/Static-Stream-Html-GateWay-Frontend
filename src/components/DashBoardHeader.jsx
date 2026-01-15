import React, { useState } from "react";
import { FaUserCircle, FaBell, FaChartLine } from "react-icons/fa";

import "../style/DashBoardHeader.css";
import api from "../utils/constants";

function DashBoardHeader() {

  const [name, setName] = useState("")

  const fetchData = async () => {
    try {
      const res = await api.get("/headlines/profile");
      setName(res.data.name);


    }
    catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header className="main-nav-header">
      <div className="logo-section">
        <div className="logo-icon-wrapper">
          <FaChartLine size={24} className="logo-icon" />
        </div>
        <div className="logo-text">
          <h2>StaticStream</h2>

        </div>
      </div>

      <div className="header-actions">

        <button className="icon-btn">
          <FaBell size={18} />
          <span className="notification-badge">3</span>
        </button>


        <div className="profile">
          <FaUserCircle size={32} className="profile-icon" />
          <div className="profile-info">
            <span className="username">{name || "Loading..."}</span>

          </div>
        </div>
      </div>
    </header>
  );
}

export default DashBoardHeader;
