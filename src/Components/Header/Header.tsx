import React from "react";
import "./Header.css";
import Signout from "../Auth/SignOut/SignOut";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logout-container">
        <Signout />
      </div>
      <h3>Pesa-Minds</h3>
    </header>
  );
};

export default Header;
