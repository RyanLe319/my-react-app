import React from 'react';
import './sortBy.css'; // We'll create this

function SortBy({ currentSort, onSortChange }) {
  return (
    <div className="sort-by-container">
      <label className="sort-by-label">Sort by:</label>
      <select
        className="sort-by-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="a-z">A-Z</option>
        <option value="newest">Recently Added</option>
        <option value="updated">Recently Updated</option>
        <option value="chapters">Most Chapters</option>
        <option value="unread">Most Unread</option>
      </select>
    </div>
  );
}

export default SortBy;