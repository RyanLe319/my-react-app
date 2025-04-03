import React, { useState, useEffect } from "react";
import "./mangaGrid.css";
import MangaCard from "./MangaCard";

// Hardcoded manga data matching your schema
const demoMangaData = [
  {
    manga_id: 1,
    title: "One Piece",
    alternative_title: "ワンピース",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Monkey D. Luffy sets off on an adventure to become the Pirate King!",
    latest_chapter: 1100,
    latest_chapter_date: "2023-11-20",
    last_chapter_read: 1050,
    date_added_to_watchlist: "2023-01-15"
  },
  {
    manga_id: 2,
    title: "Berserk",
    alternative_title: "ベルセルク",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Hiatus",
    description: "Guts, the Black Swordsman, battles demonic forces in a medieval dark fantasy world.",
    latest_chapter: 375,
    latest_chapter_date: "2023-11-15",
    last_chapter_read: 370,
    date_added_to_watchlist: "2022-11-01"
  },
  {
    manga_id: 3,
    title: "Attack on Titan",
    alternative_title: "進撃の巨人",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Completed",
    description: "Humanity fights for survival against man-eating Titans.",
    latest_chapter: 139,
    latest_chapter_date: "2021-04-09",
    last_chapter_read: 139,
    date_added_to_watchlist: "2021-03-10"
  },
  {
    manga_id: 4,
    title: "Chainsaw Man",
    alternative_title: "チェンソーマン",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Denji becomes Chainsaw Man after merging with his devil pet Pochita.",
    latest_chapter: 150,
    latest_chapter_date: "2023-11-21",
    last_chapter_read: 145,
    date_added_to_watchlist: "2023-02-05"
  },
  {
    manga_id: 5,
    title: "Jujutsu Kaisen",
    alternative_title: "呪術廻戦",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Yuji Itadori becomes host to the powerful curse Ryomen Sukuna.",
    latest_chapter: 245,
    latest_chapter_date: "2023-11-19",
    last_chapter_read: 240,
    date_added_to_watchlist: "2023-01-20"
  },
  {
    manga_id: 6,
    title: "Vinland Saga",
    alternative_title: "ヴィンランド・サガ",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Thorfinn seeks revenge in the Viking age before discovering pacifism.",
    latest_chapter: 205,
    latest_chapter_date: "2023-11-17",
    last_chapter_read: 200,
    date_added_to_watchlist: "2022-12-15"
  },
  {
    manga_id: 7,
    title: "Demon Slayer",
    alternative_title: "鬼滅の刃",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Completed",
    description: "Tanjiro Kamado becomes a demon slayer to cure his sister Nezuko.",
    latest_chapter: 205,
    latest_chapter_date: "2020-05-18",
    last_chapter_read: 205,
    date_added_to_watchlist: "2020-04-10"
  },
  {
    manga_id: 8,
    title: "Tokyo Revengers",
    alternative_title: "東京卍リベンジャーズ",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Completed",
    description: "Takemichi time-leaps to save his girlfriend from a tragic future.",
    latest_chapter: 278,
    latest_chapter_date: "2022-11-16",
    last_chapter_read: 275,
    date_added_to_watchlist: "2022-10-05"
  },
  {
    manga_id: 9,
    title: "Spy x Family",
    alternative_title: "スパイファミリー",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "A spy, assassin, and telepath form a fake family for their missions.",
    latest_chapter: 90,
    latest_chapter_date: "2023-11-18",
    last_chapter_read: 85,
    date_added_to_watchlist: "2023-03-12"
  },
  {
    manga_id: 10,
    title: "My Hero Academia",
    alternative_title: "僕のヒーローアカデミア",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Quirkless Izuku Midoriya inherits One For All to become a hero.",
    latest_chapter: 410,
    latest_chapter_date: "2023-11-20",
    last_chapter_read: 405,
    date_added_to_watchlist: "2023-02-18"
  },
  {
    manga_id: 11,
    title: "Blue Lock",
    alternative_title: "ブルーロック",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "Japan trains strikers through a brutal survival soccer program.",
    latest_chapter: 240,
    latest_chapter_date: "2023-11-16",
    last_chapter_read: 235,
    date_added_to_watchlist: "2023-01-25"
  },
  {
    manga_id: 12,
    title: "Oshi no Ko",
    alternative_title: "【推しの子】",
    cover_art_url: "https://mangaplus.shueisha.co.jp/drm/title/100020/title_thumbnail/31963.webp",
    status: "Ongoing",
    description: "A doctor is reincarnated as the child of his favorite idol.",
    latest_chapter: 140,
    latest_chapter_date: "2023-11-15",
    last_chapter_read: 135,
    date_added_to_watchlist: "2023-03-05"
  }
];

function MangaGrid({ currentPage, isWatchlist = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate pagination
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = demoMangaData.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteSuccess = () => {
    alert("Delete functionality disabled in demo mode");
  };

  if (loading) return <div className="loading">Loading manga...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="manga-grid">
      {paginatedData.map((manga) => (
        <MangaCard 
          key={manga.manga_id}
          manga={manga}
          onDeleteSuccess={handleDeleteSuccess}
        />
      ))}
      <div className="demo-notice">
        DEMO MODE: Showing hardcoded data (Page {currentPage})
      </div>
    </div>
  );
}

export default MangaGrid;