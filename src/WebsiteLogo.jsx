import React from "react";
import { Link } from "react-router-dom";
import TurtleLogo from "./assets/TurtleLogo2.png";
import "./websiteLogo.css";

function WebsiteLogo() {
  return (
    <Link to="/" className="logo-link">
      <img src={TurtleLogo} className="turtleLogo" alt="Turtle logo" />
    </Link>
  );
}

export default WebsiteLogo;