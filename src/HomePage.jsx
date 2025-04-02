import React from "react";
import MangaGrid from "./MangaGrid";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <MangaGrid />
      <button 
        className="home-more-button" 
        onClick={() => navigate('/advancesearch')}
      >
        More
      </button>
    </div>
  );
}

export default HomePage;