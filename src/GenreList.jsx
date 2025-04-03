import React, { useState } from "react";
import "./genreList.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function GenreList() {
  const [genres, setGenres] = useState(["Adventure", "Action", "Romance", "Comedy"]);
  const [showModal, setShowModal] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [editingGenre, setEditingGenre] = useState(null);

  const handleAddGenre = () => {
    const trimmedGenre = newGenre.trim();
    if (trimmedGenre && !genres.includes(trimmedGenre)) {
      setGenres([...genres, trimmedGenre]);
      setNewGenre("");
      setShowModal(false);
    }
  };

  const handleDeleteGenre = (genreToDelete) => {
    setGenres(genres.filter(genre => genre !== genreToDelete));
  };

  const handleEditGenre = (genre) => {
    setEditingGenre(genre);
    setNewGenre(genre);
    setShowModal(true);
  };

  const handleUpdateGenre = () => {
    const trimmedGenre = newGenre.trim();
    if (trimmedGenre && editingGenre) {
      setGenres(genres.map(genre => 
        genre === editingGenre ? trimmedGenre : genre
      ));
      setNewGenre("");
      setEditingGenre(null);
      setShowModal(false);
    }
  };

  const confirmDelete = (genre) => {
    if (window.confirm(`Are you sure you want to delete "${genre}"?`)) {
      handleDeleteGenre(genre);
    }
  };

  return (
    <div className="genre-filter-box">
      <div className="filter-header">
        <h3 className="filter-title">Genres</h3>
        <button 
          className="add-genre-btn" 
          onClick={() => {
            setEditingGenre(null);
            setNewGenre("");
            setShowModal(true);
          }}
        >
          + Add Genre
        </button>
      </div>
      
      <div className="genre-grid">
        {genres.map((genre) => (
          <div key={genre} className="genre-item-container">
            <label className="genre-item">
              <input type="checkbox" />
              <span>{genre}</span>
            </label>
            <div className="genre-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEditGenre(genre)}
                aria-label={`Edit ${genre}`}
              >
                <EditIcon/>
              </button>
              <button 
                className="delete-btn"
                onClick={() => confirmDelete(genre)}
                aria-label={`Delete ${genre}`}
              >
                <DeleteIcon/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="genre-modal">
          <div className="modal-content">
            <h4>{editingGenre ? "Edit Genre" : "Add New Genre"}</h4>
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Enter genre name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && (editingGenre ? handleUpdateGenre() : handleAddGenre())}
            />
            <div className="modal-actions">
              <button 
                className="modal-add-btn" 
                onClick={editingGenre ? handleUpdateGenre : handleAddGenre}
              >
                {editingGenre ? "Update" : "Add"}
              </button>
              <button 
                className="modal-cancel-btn" 
                onClick={() => {
                  setShowModal(false);
                  setEditingGenre(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenreList;