import React, { useState } from "react";
import "./AddMangaForm.css";

function AddMangaForm({ isOpen, onClose, onSuccess }) {
  const initialFormState = {
    title: "",
    lastChapterRead: "",
    lastReadDate: "",
    status: "",
    latestChapter: "",
    latestChapterDate: "",
    description: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-expand textarea
    if (name === "description" && e.target.scrollHeight > e.target.clientHeight) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error if user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenres(genres.filter(genre => genre !== genreToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddGenre();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      setErrors({ title: "Title is required" });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send data to Express backend
      const response = await fetch("http://localhost:3000/adding-manga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          genres: genres.length ? genres : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add manga");
      }

      const result = await response.json();
      console.log("Success:", result);

      // Reset form and close
      setFormData(initialFormState);
      setGenres([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close form"
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2>Add New Manga</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genres</label>
            <div className="genre-input-container">
              <input
                type="text"
                id="genre"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter genre and click Add"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="add-genre-btn"
                onClick={handleAddGenre}
                disabled={isSubmitting || !genreInput.trim()}
              >
                Add
              </button>
            </div>
            {genres.length > 0 && (
              <div className="genre-tags-container">
                {genres.map((genre) => (
                  <span key={genre} className="genre-tag">
                    {genre}
                    <button
                      type="button"
                      className="remove-genre-btn"
                      onClick={() => handleRemoveGenre(genre)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastChapterRead">Last Chapter Read</label>
            <input
              type="number"
              id="lastChapterRead"
              name="lastChapterRead"
              min="0"
              value={formData.lastChapterRead}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastReadDate">Date Last Read</label>
            <input
              type="date"
              id="lastReadDate"
              name="lastReadDate"
              value={formData.lastReadDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Stacking">Stacking</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="latestChapter">Latest Chapter Available</label>
            <input
              type="number"
              id="latestChapter"
              name="latestChapter"
              min="0"
              value={formData.latestChapter}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="latestChapterDate">Latest Chapter Available Date</label>
            <input
              type="date"
              id="latestChapterDate"
              name="latestChapterDate"
              value={formData.latestChapterDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="auto-expand-textarea"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Cover Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              disabled={isSubmitting}
            />
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="submitting-text">
                Adding... <span className="spinner"></span>
              </span>
            ) : (
              "Add Manga"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMangaForm;