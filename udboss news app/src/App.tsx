import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const API_KEY = import.meta.env.VITE_GNEWS_KEY;

interface Article {
  title: string;
  description: string;
  url: string;
  image: string;
  source: { name: string; url: string };
  publishedAt: string;
}

const categories = ["world", "business", "technology", "sports", "entertainment"];

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("udboss_theme");
    return saved ? saved === "dark" : true;
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("world");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState<Article[]>(() => {
    const saved = localStorage.getItem("udboss_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    localStorage.setItem("udboss_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("udboss_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const requestUrl = useMemo(() => {
    if (!API_KEY) return "";
    if (query.trim()) {
      return `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&max=12&page=${page}&token=${API_KEY}`;
    }
    return `https://gnews.io/api/v4/top-headlines?category=${activeCategory}&lang=en&max=12&page=${page}&token=${API_KEY}`;
  }, [activeCategory, query, page]);

  useEffect(() => {
    const fetchNews = async () => {
      if (!API_KEY) {
        setError("API key missing. Add VITE_GNEWS_KEY in .env");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(requestUrl);
        const data = await res.json();
        if (data.errors) {
          setError(data.errors.join(", "));
        } else {
          setError("");
          setArticles((prev) =>
            page === 1 ? data.articles || [] : [...prev, ...(data.articles || [])]
          );
        }
      } catch {
        setError("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [requestUrl]);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);

  const toggleFavorite = (article: Article) => {
    if (favorites.find((f) => f.url === article.url)) {
      setFavorites(favorites.filter((f) => f.url !== article.url));
    } else {
      setFavorites([...favorites, article]);
    }
  };
  const isFavorite = (url: string) => favorites.some((f) => f.url === url);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <h1 className="title">📰 UDBOSS News</h1>

      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>

      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat && !query ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              setQuery("");
              setPage(1);
              setArticles([]);
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).querySelector("input") as HTMLInputElement;
          if (input.value.trim()) {
            setQuery(input.value.trim());
            setPage(1);
            setArticles([]);
          }
        }}
        className="search-bar"
      >
        <input type="text" placeholder="Search news..." className="search-input" />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {error && <p className="error-msg">⚠️ {error}</p>}

      <div className="news-grid">
        {articles.map((a, idx) => (
          <motion.div
            key={a.url + idx}
            className="news-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.6) }}
          >
            <button
              className={`fav-icon ${isFavorite(a.url) ? "active" : ""}`}
              onClick={() => toggleFavorite(a)}
              aria-label="Toggle favorite"
            >
              ★
            </button>
            <a href={a.url} target="_blank" rel="noopener noreferrer">
              {a.image && <img src={a.image} alt={a.title} />}
              <div className="news-content">
                <h2>{a.title}</h2>
                <p>
                  {a.description && a.description.length > 120
                    ? a.description.slice(0, 120) + "..."
                    : a.description}
                </p>
                <span className="source">Source: {a.source?.name}</span>
                <span className="date">
                  {new Date(a.publishedAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      <div ref={loaderRef} className="infinite-loader">
        {loading && <p className="loading-pulse">Loading more…</p>}
      </div>

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2>⭐ Favorites</h2>
          <div className="favorites-grid">
            {favorites.map((f, idx) => (
              <a key={f.url + idx} href={f.url} target="_blank" rel="noopener noreferrer" className="favorite-card">
                {f.image && <img src={f.image} alt={f.title} />}
                <h3>{f.title}</h3>
              </a>
            ))}
          </div>
        </div>
      )}

      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆️
        </button>
      )}
    </div>
  );
}
