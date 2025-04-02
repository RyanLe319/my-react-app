import React, { useState, useEffect } from "react";
import MangaGrid from "./MangaGrid";
import PaginationControls from "./PaginationControls";
import "./advanceSearchPage.css";

function AdvanceSearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Get from API

  // Fetch total pages from backend
  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/manga?page=1&limit=10");
        if (!response.ok) throw new Error("Failed to fetch total pages");

        const data = await response.json();
        setTotalPages(Math.ceil(data.pagination.total / 10)); // Calculate total pages
      } catch (err) {
        console.error("Error fetching total pages:", err);
      }
    };

    fetchTotalPages();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="advance-search-container">
      <MangaGrid currentPage={currentPage} />
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdvanceSearchPage;
