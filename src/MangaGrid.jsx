import React, { useState, useEffect } from "react";
import "./mangaGrid.css";
import MangaCard from "./MangaCard";

function MangaGrid({ currentPage }) {
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10; // Ensure limit matches backend

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/api/manga?page=${currentPage}&limit=${limit}`);
        
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
  }, [currentPage]); // Re-fetch when page changes

  
  const handleDeleteSuccess = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/manga?page=${currentPage}&limit=${limit}`);
      
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
