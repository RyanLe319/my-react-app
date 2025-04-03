import React, { useState, useEffect } from "react";
import MangaGrid from "./MangaGrid";
import PaginationControls from "./PaginationControls";
import "./watchListPage.css";

function WatchListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/watchlist?page=1&limit=10`
        );
        if (!response.ok) throw new Error("Failed to fetch watchlist");

        const data = await response.json();
        setTotalPages(Math.ceil(data.pagination.total / 10));
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchTotalPages();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="watchlist-container">
      <h1>Your Watchlist</h1>
      <MangaGrid 
        currentPage={currentPage} 
        isWatchlist={true}  // Key difference!
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default WatchListPage;