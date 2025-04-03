import React, { useState, useEffect } from "react";
import "./mangaGrid.css";
import MangaCard from "./MangaCard";

function MangaGrid({ currentPage, isWatchlist = false }) {  // Default to false for backward compatibility
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = isWatchlist
          ? `http://localhost:3000/api/watchlist?page=${currentPage}&limit=${limit}`
          : `http://localhost:3000/api/manga?page=${currentPage}&limit=${limit}`;

        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setMangaList(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [currentPage, isWatchlist]);  // Re-fetch when page OR mode changes

  const handleDeleteSuccess = async () => {
    try {
      const endpoint = isWatchlist
        ? `http://localhost:3000/api/watchlist?page=${currentPage}&limit=${limit}`
        : `http://localhost:3000/api/manga?page=${currentPage}&limit=${limit}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setMangaList(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading manga...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="manga-grid">
      {mangaList.map((manga) => (
        <MangaCard 
          key={manga.manga_id}
          manga={manga}
          onDeleteSuccess={handleDeleteSuccess}
        />
      ))}
    </div>
  );
}

export default MangaGrid;
