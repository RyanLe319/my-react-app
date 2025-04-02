import React, { useState, useEffect } from "react";
import "./mangaGrid.css";
import MangaCard from "./MangaCard";

function MangaGrid() {
  const [mangaList, setMangaList] = useState([]);
  const [maxDisplay, setMaxDisplay] = useState(10); // Configurable display limit

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(`http://localhost:3000/manga?limit=${maxDisplay}`);
        const data = await response.json();
        setMangaList(data);
      } catch (error) {
        console.error("Error fetching manga:", error);
      }
    };

    fetchManga();
  }, [maxDisplay]);

  return (
    <div className="manga-grid">
      {mangaList.map((manga) => (
        <MangaCard 
          key={manga.manga_id}
          manga={manga} 
        />
      ))}
    </div>
  );
}

export default MangaGrid;