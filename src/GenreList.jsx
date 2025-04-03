import React, { useState, useEffect } from "react";
import "./genreList.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function GenreList() {
  const [genres, setGenres] = useState([]); // Start with an empty array
  const [showModal, setShowModal] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [editingGenre, setEditingGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/genres");
            if (!response.ok) {
                throw new Error("Failed to fetch genres");
            }

            const data = await response.json(); // Convert response to JSON
            setGenres(data.map(genre => genre.genre_name)); // Store genre names in state
        } catch (error) {
            console.error("Error fetching genres: ", error);
        }
    };

    fetchGenres();

    }, []);

     // Log genres whenever they change
  useEffect(() => {
    console.log("Updated genres:", genres);
  }, [genres]); // This effect runs every time 'genres' changes




  const handleAddGenre = async () => {
  const trimmedGenre = newGenre.trim();
  if (trimmedGenre && !genres.includes(trimmedGenre)) {
    // Make POST request to add the genre to the database
    try {
      const response = await fetch("http://localhost:3000/api/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genre_name: trimmedGenre }),
      });

      if (!response.ok) {
        throw new Error("Failed to add genre");
      }

      const newGenreData = await response.json();

      // Update the genres state with the newly added genre
      setGenres((prevGenres) => [...prevGenres, newGenreData.genre_name]);
      setNewGenre("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding genre: ", error);
    }
  }
};


  // Function to start editing the genre
    const handleEditGenre = (genre) => {
        setEditingGenre(genre); // Set the genre being edited
        setNewGenre(genre); // Set the current genre name in the input field
        setShowModal(true); // Show the modal
    };
  
    const handleUpdateGenre = async () => {
        const trimmedGenre = newGenre.trim();
        if (trimmedGenre && editingGenre) {
        try {
            const encodedGenreName = encodeURIComponent(editingGenre);
            const response = await fetch(`http://localhost:3000/api/genres/${encodedGenreName}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genre_name: trimmedGenre }),
            });
            if (!response.ok) throw new Error("Failed to update genre");
            const updatedGenre = await response.json();
            setGenres(genres.map(genre => 
            genre === editingGenre ? updatedGenre.genre_name : genre
            ));
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
        const response = await fetch(`http://localhost:3000/api/genres/${encodedGenreName}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete genre");
        }

        // Update the state to remove the deleted genre
        setGenres((prevGenres) => prevGenres.filter((genre) => genre !== genreToDelete));
        } catch (error) {
        console.error("Error deleting genre:", error);
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