import React from "react";
import MangaGrid from "./MangaGrid";
import "./advanceSearchPage.css";

function AdvanceSearchPage() {
    return (
        <div className="advance-search-container">
            <div className="genre-filter-box">
                <h3 className="filter-title">Genres</h3>
                <div className="genre-grid">
                    {/* Row 1 */}
                    <label className="genre-item">
                        <input type="checkbox" />
                        <span>Adventure</span>
                    </label>
                    <label className="genre-item">
                        <input type="checkbox" />
                        <span>Action</span>
                    </label>
                    <label className="genre-item">
                        <input type="checkbox" />
                        <span>Romance</span>
                    </label>
                    
                    {/* Row 2 */}
                    <label className="genre-item">
                        <input type="checkbox" />
                        <span>Comedy</span>
                    </label>
                </div>
            </div>
            <MangaGrid />
        </div>
    );
}

export default AdvanceSearchPage;