import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./mangaDetails.css";

// Same demo data as in MangaGrid
const demoMangaData = [
  {
    manga_id: 1,
    title: "One Piece",
    alternative_title: "ワンピース",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Monkey D. Luffy sets off on an adventure to become the Pirate King!",
    latest_chapter: 1100,
    latest_chapter_date: "2023-11-20",
    last_chapter_read: 1050,
    date_added_to_watchlist: "2023-01-15",
    year_published: 1997,
    record_created: "2023-01-10",
    record_updated_date: "2023-11-20",
    genres: [
      { genre_id: 1, genre_name: "Adventure" },
      { genre_id: 2, genre_name: "Action" },
      { genre_id: 3, genre_name: "Fantasy" }
    ]
  },
  // ... include all 12 manga entries from MangaGrid here
  // Make sure each has the same structure with genres array
];

function MangaDetails() {
  const { manga_id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false since we're using local data

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const foundManga = demoMangaData.find(m => m.manga_id === Number(manga_id));
      setManga(foundManga || null);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [manga_id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (!manga) return <div className="not-found-container">Manga not found</div>;

  return (
    <div className="page-container">
      <div className="content-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="demo-banner">
          DEMO MODE - Using cached data
        </div>

        <div className="manga-header">
          <div className="cover-art">
            <img
              src={manga.cover_art_url || "https://media1.tenor.com/m/UNpuEsjDH_MAAAAC/one-piece-one-piece-zoro.gif"}
              alt={manga.title}
              onError={(e) => {
                e.target.src = "https://media1.tenor.com/m/UNpuEsjDH_MAAAAC/one-piece-one-piece-zoro.gif";
              }}
            />
          </div>
          <div className="title-section">
            <h1>{manga.title}</h1>
            {manga.alternative_title && (
              <h2 className="alternative-title">{manga.alternative_title}</h2>
            )}
            <div className="status-badge">{manga.status}</div>
          </div>
        </div>

        <div className="manga-content">
          <div className="details-section">
            <h3>Details</h3>
            <div className="details-grid">
              {/* All your existing detail items */}
              <div className="detail-item">
                <span className="detail-label">Year Published:</span>
                <span>{manga.year_published || 'N/A'}</span>
              </div>
              {/* ... keep all other detail items ... */}
            </div>
          </div>

          <div className="genres-section">
            <h3>Genres</h3>
            <div className="genres-list">
              {manga.genres && manga.genres.length > 0 ? (
                manga.genres.map(genre => (
                  <span key={genre.genre_id} className="genre-tag">
                    {genre.genre_name}
                  </span>
                ))
              ) : (
                <span>No genres listed</span>
              )}
            </div>
          </div>

          {manga.description && (
            <div className="description-section">
              <h3>Description</h3>
              <p>{manga.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MangaDetails;