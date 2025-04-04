import React, { useState, useEffect } from "react";
import "./genreList.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear'; // New import


function GenreList({ onSubmitData, initialGenres = [], initialMinChapters = 0}) {
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [editingGenre, setEditingGenre] = useState(null);
  const [minChapters, setMinChapters] = useState(initialMinChapters);
  const [showArrows, setShowArrows] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);

  // Sync with parent's initial values
  useEffect(() => {
    setSelectedGenres(initialGenres);
    setMinChapters(initialMinChapters);
  }, [initialGenres, initialMinChapters]);

  const increment = () => setMinChapters(prev => prev + 1);
  const decrement = () => setMinChapters(prev => Math.max(1, prev - 1));

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/genres");
        if (!response.ok) throw new Error("Failed to fetch genres");
        const data = await response.json();
        setGenres(data.map(genre => genre.genre_name));
      } catch (error) {
        console.error("Error fetching genres: ", error);
      }
    };
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    const trimmedGenre = newGenre.trim();
    if (trimmedGenre && !genres.includes(trimmedGenre)) {
      try {
        const response = await fetch("http://localhost:3000/api/genres", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ genre_name: trimmedGenre }),
        });
        if (!response.ok) throw new Error("Failed to add genre");
        const newGenreData = await response.json();
        setGenres(prev => [...prev, newGenreData.genre_name]);
        setNewGenre("");
        setShowModal(false);
      } catch (error) {
        console.error("Error adding genre: ", error);
      }
    }
  };

  const handleEditGenre = (genre) => {
    setEditingGenre(genre);
    setNewGenre(genre);
    setShowModal(true);
  };

  const handleUpdateGenre = async () => {
    const trimmedGenre = newGenre.trim();
    if (trimmedGenre && editingGenre) {
      try {
        const encodedGenreName = encodeURIComponent(editingGenre);
        const response = await fetch(
          `http://localhost:3000/api/genres/${encodedGenreName}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genre_name: trimmedGenre }),
          });
        if (!response.ok) throw new Error("Failed to update genre");
        const updatedGenre = await response.json();
        setGenres(genres.map(g => g === editingGenre ? updatedGenre.genre_name : g));
        setNewGenre("");
        setEditingGenre(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error updating genre: ", error);
      }
    }
  };

  const handleDeleteGenre = async (genreToDelete) => {
    try {
      const encodedGenreName = encodeURIComponent(genreToDelete);
      const response = await fetch(
        `http://localhost:3000/api/genres/${encodedGenreName}`, {
          method: "DELETE",
        });
      if (!response.ok) throw new Error("Failed to delete genre");
      setGenres(prev => prev.filter(g => g !== genreToDelete));
      setSelectedGenres(prev => prev.filter(g => g !== genreToDelete));
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  const confirmDelete = (genre) => {
    if (window.confirm(`Delete "${genre}"?`)) {
      handleDeleteGenre(genre);
    }
  };

  const handleGenreSelection = (event, genre) => {
    const updatedGenres = event.target.checked
      ? [...selectedGenres, genre]
      : selectedGenres.filter(g => g !== genre);
    setSelectedGenres(updatedGenres);
  };

  const handleMinChaptersChange = (value) => {
    const numValue = Math.max(0, Number(value) || 0);
    setMinChapters(numValue);
  };

  const handleSearch = () => {
    onSubmitData({
      selectedGenres,
      minChapters
    });
  };

  // New reset function
  const handleResetFilters = () => {
    setSelectedGenres([]);
    setMinChapters(0);
    // Immediately submit the reset state to parent
    onSubmitData({
      selectedGenres: [],
      minChapters: 0
    });
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
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={(e) => handleGenreSelection(e, genre)}
              />
              <span>{genre}</span>
            </label>
            <div className="genre-actions">
              <button
                className="edit-btn"
                onClick={() => handleEditGenre(genre)}
                aria-label={`Edit ${genre}`}
              >
                <EditIcon fontSize="small" />
              </button>
              <button
                className="delete-btn"
                onClick={() => confirmDelete(genre)}
                aria-label={`Delete ${genre}`}
              >
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </div>
        ))}
      </div>
  
      <div className="bottom-controls-row">
        <div
          className="number-stepper"
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          <span className="stepper-label">Min Chapters:</span>
          <div className="stepper-input-container">
            <input
              type="number"
              min="0"
              value={minChapters}
              onChange={(e) => handleMinChaptersChange(e.target.value)}
              className="stepper-input"
            />
            {showArrows && (
              <div className="stepper-arrows">
                <button 
                  onClick={increment} 
                  className="stepper-arrow up"
                >
                  ▲
                </button>
                <button 
                  onClick={decrement} 
                  className="stepper-arrow down"
                >
                  ▼
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="filter-buttons-group">
            <button 
            className="reset-filters-btn"
            onClick={handleResetFilters}
            aria-label="Reset filters"
            >
            Clear
            </button>
            <button className="search-genre-btn" onClick={handleSearch}>
            Search
            </button>
        </div>
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