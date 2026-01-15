import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Header() {
  const { userData } = useContext(AppContext);

  return (
    <div
      className="text-center d-flex flex-column align-items justify-content-center py-5 px-3"
      style={{ minHeight: "80vh" }}
    >
      <img src="" alt="header" width={120} className="mb-4" />
      <h5 className="fw-semibold">
        Hey {userData ? userData.name : "Developer"}{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
      </h5>
      
    </div>
  );
}

export default Header;
