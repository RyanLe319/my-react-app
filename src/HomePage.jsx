import React, { useState, useEffect } from "react";
import MangaGrid from "./MangaGrid";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMangaCount, setTotalMangaCount] = useState(0);
  const [filterData] = useState({
    selectedGenres: [],
    minChapters: 0,
    currentSort: 'newest'
  });

  // Fetch total manga count on component mount
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/manga?page=1&limit=1');
        if (!response.ok) throw new Error("Failed to fetch total count");
        const data = await response.json();
        setTotalMangaCount(data.pagination.total);
      } catch (err) {
        console.error("Error fetching total count:", err);
      }
    };
    fetchTotalCount();
  }, []);

  const handleMoreClick = () => {
    // Calculate the initial page for advanced search
    const initialPage = Math.ceil(totalMangaCount / 10);
    navigate('/advancesearch', { state: { initialPage } });
  };

  return (
    <div className="home-page">
      <MangaGrid 
        currentPage={currentPage} 
        filterData={filterData}
      />
      <button 
        className="home-more-button" 
        onClick={handleMoreClick}
      >
        More
      </button>
    </div>
  );
}

export default HomePage;