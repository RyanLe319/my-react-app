import React from "react";
import "./mangaCard0.css";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';

function MangaCard({ manga }) {
  // Calculate unread chapters (protect against negative numbers)
  const unreadChapters = Math.max(0, 
    (manga.latest_chapter || 0) - (manga.last_chapter_read || 0)
  );

  return (
    <div className="manga-card">
      <div className="manga-card-image">
        <img 
          src={manga.cover_art_url || "https://via.placeholder.com/150x200?text=No+Cover"} 
          alt={manga.title} 
        />
      </div>
      <div className="manga-card-info">
        <div className="corner-badge">{manga.status || "Unknown"}</div>
        <div className="title-group">
          <h2 className="main-title">{manga.title}</h2>
          <p className="alt-title">{manga.alternative_title || ""}</p>
        </div>
        <div className="chapter-group">
          <h2 className="sub-titles">
            Last Chapter Read: {manga.last_chapter_read || "0"} - 
            {manga.last_read_date ? ` (${new Date(manga.last_read_date).toLocaleDateString()})` : ""}
          </h2>
          <p className="chapter-difference">
            # of Unread Chapters: {unreadChapters}
          </p>
          <h2 className="sub-titles">
            Latest Chapter: {manga.latest_chapter || "N/A"} - 
            {manga.latest_chapter_date ? ` (${new Date(manga.latest_chapter_date).toLocaleDateString()})` : ""}
          </h2>
        </div>
        <div className="description-group">
          <h2 className="description-title">Description: </h2>
          <p>{manga.description || "No description available"}</p>
        </div>
        <div className="button-group">
          <Link to={`/mangadetails/${manga.manga_id}`} className="edit">
            <button><EditIcon /></button>
          </Link>
          <Link to={`/mangadetails/${manga.manga_id}`} className="more">More</Link>
        </div>
      </div>
    </div>
  );
}

export default MangaCard;