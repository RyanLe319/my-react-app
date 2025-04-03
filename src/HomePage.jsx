import React, { useState } from "react";
import MangaGrid from "./MangaGrid";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="home-page">
      <MangaGrid currentPage={currentPage} />
      <button 
        className="home-more-button" 
        onClick={() => navigate('/advancesearch', { state: { initialPage: currentPage + 1 } })}
      >
        More
      </button>
    </div>
  );
}

export default HomePage;