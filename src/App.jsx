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

function App() {
	const [count, setCount] = useState(0);

	return (
		// <>
		//   <div>
		//     <a href="https://vite.dev" target="_blank">
		//       <img src={viteLogo} className="logo" alt="Vite logo" />
		//     </a>
		//     <a href="https://react.dev" target="_blank">
		//       <img src={reactLogo} className="logo react" alt="React logo" />
		//     </a>
		//   </div>
		//   <h1>Vite + React</h1>
		//   <div className="card">
		//     <button onClick={() => setCount((count) => count + 1)}>
		//       count is {count}
		//     </button>
		//     <p>
		//       Edit <code>src/App.jsx</code> and save to test HMR
		//     </p>
		//   </div>
		//   <p className="read-the-docs">
		//     Click on the Vite and React logos to learn more
		//   </p>
		// </>
		<Router>
      <div className="container" >
        <Header /> {/* Header with navigation links */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home route */}
          <Route path="/watchlist" element={<WatchListPage />} /> {/* WatchList route */}
          <Route path="/advancesearch" element={<AdvanceSearchPage />} /> {/* Advance Search route */}
          <Route path="/manga-details" element={<HomePage />} />
        </Routes>
        <Footer/>
        
      </div>
    </Router>
	);
}

export default App;
