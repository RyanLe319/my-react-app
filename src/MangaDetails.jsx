import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./mangaDetails.css";

function MangaDetails() {
  const { manga_id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/manga/${manga_id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setManga(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [manga_id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) return <div className="loading-container">Loading manga details...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!manga) return <div className="not-found-container">Manga not found</div>;

  return (
    <div className="page-container">
      <div className="content-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

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
              <div className="detail-item">
                <span className="detail-label">Year Published:</span>
                <span>{manga.year_published || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Latest Chapter:</span>
                <span>{manga.latest_chapter || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Latest Chapter Date:</span>
                <span>{formatDate(manga.latest_chapter_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Chapter Read:</span>
                <span>{manga.last_chapter_read || '0'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Chapters Behind:</span>
                <span>{Math.max(0, (manga.latest_chapter || 0) - (manga.last_chapter_read || 0))}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Added to Watchlist:</span>
                <span>{formatDate(manga.date_added_to_watchlist)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Record Created:</span>
                <span>{formatDate(manga.record_created)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span>{formatDate(manga.record_updated_date)}</span>
              </div>
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