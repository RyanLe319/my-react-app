import React from "react";
import "./mangaCard0.css";
import { Link } from "react-router-dom";


function MangaCard(){
    return(
        <div className="manga-card">
            <div className="manga-card-image">
                <img src="https://m.media-amazon.com/images/I/91yyWTPpxXL._AC_UF1000,1000_QL80_.jpg" />
            </div>
            <div className="manga-card-info">
                <div className="corner-badge">OnGoing</div>
                <div className="title-group">
                    <h2 className="main-title">One Piece</h2>
                    <p className="alt-title">ワンピース (Wan Pīsu)</p>
                </div>
                <div className="chapter-group">
                    <h2 className="sub-titles">Last Chapter Read: 1134 - (03/28/2025)</h2>
                    <p  className="chapter-difference"># of Unread Chapters: 0</p>
                    <h2 className="sub-titles">Latest Chapter: 1134 - (03/28/2025)</h2>
                </div>
                <div className="description-group">
                    <h2 className="description-title">Description: </h2>
                    <p>The Goa asdkas djklasj dsj fklajsfasdfsdf dsfjasdfjdhsfjdhsjksc sdfsdfsdasasd asdafsdjf sdjfkldjsfkl jdsklfjsdkfjdklsfjdklsjfkldsjfklsdj s dasdasd asdsdjklfjas fljwaefj iwjt</p>
                </div>
                <Link to="/manga-details" className="more">More</Link> {/* Updated to Link */}
            </div>
        </div>
    );
};

export default MangaCard;