import React, { useState, useEffect } from "react";
import MangaGrid from "./MangaGrid";
import PaginationControls from "./PaginationControls";
import { useSearchParams, useLocation } from "react-router-dom";
import "./advanceSearchPage.css";
import GenreList from "./GenreList";
import SortBy from "./SortBy";

function AdvanceSearchPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(
    location.state?.initialPage || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [filterData, setFilterData] = useState({
    selectedGenres: [],
    minChapters: 0,
    searchQuery: searchParams.get("search") || ""
  });
  const [currentSort, setCurrentSort] = useState('newest');

  // Update when URL params change
  useEffect(() => {
    setFilterData(prev => ({
      ...prev,
      searchQuery: searchParams.get("search") || ""
    }));
    // Only reset to page 1 if coming from a search, not from More button
    if (searchParams.get("search")) {
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Fetch total pages
  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const query = new URLSearchParams({
          page: 1,
          limit: 10,
          genres: filterData.selectedGenres.join(','),
          minChapters: filterData.minChapters,
          sort: currentSort,
          ...(filterData.searchQuery && { search: filterData.searchQuery })
        });

        const response = await fetch(`http://localhost:3000/api/manga?${query}`);
        if (!response.ok) throw new Error("Failed to fetch total pages");

        const data = await response.json();
        setTotalPages(Math.ceil(data.pagination.total / 10));
        
        // If the current page exceeds total pages, reset to last page
        if (currentPage > Math.ceil(data.pagination.total / 10)) {
          setCurrentPage(Math.ceil(data.pagination.total / 10));
        }
      } catch (err) {
        console.error("Error fetching total pages:", err);
      }
    };

    fetchTotalPages();
  }, [filterData, currentSort, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handleFilterData = (data) => {
    setFilterData(prev => ({
      ...prev,
      selectedGenres: Array.isArray(data.selectedGenres) ? data.selectedGenres : [],
      minChapters: Number(data.minChapters) || 1
    }));
    setCurrentPage(1);
  };

  return (
    <div className="advance-search-container">
      <GenreList 
        onSubmitData={handleFilterData} 
        initialGenres={filterData.selectedGenres}
        initialMinChapters={filterData.minChapters}
      />
      
      <SortBy currentSort={currentSort} onSortChange={setCurrentSort} />
      
      <MangaGrid 
        currentPage={currentPage} 
        filterData={{ ...filterData, currentSort }}
      />
      
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdvanceSearchPage;