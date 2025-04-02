import React, { useState } from 'react';
import './AddMangaForm.css';

function AddMangaForm({ isOpen, onClose, onSuccess }) {
  const initialFormState = {
    title: '',
    lastChapterRead: '',
    lastReadDate: '',
    status: '',
    latestChapter: '',
    image: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error if user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send data to Express backend
      const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          lastChapterRead: formData.lastChapterRead || null,
          lastReadDate: formData.lastReadDate || null,
          status: formData.status || null,
          latestChapter: formData.latestChapter || null,
          image: formData.image || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add manga');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Reset form and close
      setFormData(initialFormState);
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Submission error:', error);
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
              className={errors.title ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
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
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Dropped">Dropped</option>
              <option value="Plan to Read">Plan to Read</option>
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
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="submitting-text">
                Adding... <span className="spinner"></span>
              </span>
            ) : (
              'Add Manga'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMangaForm;