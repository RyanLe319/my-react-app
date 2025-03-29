import React from "react";
import { Link } from "react-router-dom";
import "./navLinks.css";

function NavLinks() {
  return (
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/watchlist">WatchList</Link>
      <Link to="/advancesearch">Advance Search</Link>
    </div>
  );
}

export default NavLinks;