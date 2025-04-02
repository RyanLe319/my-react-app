// import './App.css'
import react, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import React Router components
import Header from "./Header";
import WatchListPage from "./WatchListPage";
import HomePage from "./HomePage";
import AdvanceSearchPage from "./AdvanceSearchPage";
import MangaGrid from "./MangaGrid";
import Footer from "./Footer";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import { useEffect } from 'react';


function App() {
	const [count, setCount] = useState(0);


	return (
		<Router>
			<ScrollToTop />
			<div className="container" >
				<Header /> {/* Header with navigation links */}
			<div className="body-section">
				<Routes>
					<Route path="/" element={<HomePage />} /> {/* Home route */}
					<Route path="/watchlist" element={<WatchListPage />} /> {/* WatchList route */}
					<Route path="/advancesearch" element={<AdvanceSearchPage />} /> {/* Advance Search route */}
					<Route path="/mangadetails" element={<HomePage />} />
					<Route path="/addmanga" element={<HomePage />} />
				</Routes>
			</div>
        
        <Footer/>
        
      </div>
    </Router>
	);
}

export default App;
