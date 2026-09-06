import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import './App.css';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import MobileNav from './components/MobileNav';
import homeContent from '../content/home/intro.json';
import mapImage from '../content/home/map.webp';
import articles from '../content/articles.json';
import { getImageUrl } from './utils/imageUtils';
import { formatDate } from './utils/formatDate';

const featuredEssays = Object.values(
  articles.reduce((sections, article) => {
    (sections[article.section] ||= []).push(article);
    return sections;
  }, {})
).map((sectionArticles) => (
  [...sectionArticles].sort((a, b) => new Date(a.date) - new Date(b.date))[0]
));

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isVisible, setIsVisible] = useState(false);
  const [startHereIndex, setStartHereIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show animation when user scrolls past 30% of viewport
      // Hide when scrolling back up above 20%
      if (scrollPosition > windowHeight * 0.3) {
        setIsVisible(true);
      } else if (scrollPosition < windowHeight * 0.2) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check on mount in case already scrolled
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <header className={`header ${isHome ? 'home' : ''}`}>
        {isMobile ? (
          <nav className="nav-menu mobile">
            <MobileNav />
          </nav>
        ) : (
          !isHome && (
            <nav className="nav-menu">
              <div className="nav-links">
                <Link to="/" className="nav-brand">INDEPENDENTLY THINKING HUMAN.</Link>
              </div>
            </nav>
          )
        )}
        {isHome && (
          <div className={`hero-content ${isMobile ? 'mobile-view' : ''}`}>
            <h1 className={`main-title ${isMobile ? 'mobile-view' : ''}`}>INDEPENDENTLY<br />THINKING HUMAN.</h1>
            <p className="hero-subtitle">
              Balancing between Order and Chaos while navigating through Life's Complexities
            </p>
            <Link to="/library" className="hero-cta">Explore the library</Link>

          </div>
        )}
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <div className={`content-section ${isVisible ? 'visible' : ''}`}>
                <section className="featured-posts">
                  <div className="intro-layout">
                    <div className="intro-text">
                      <h1>{homeContent.title}</h1>
                      {homeContent.content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                      <Link to="/library" className="intro-link">Explore the library →</Link>
                    </div>
                    <div className="intro-image">
                      <img
                        src={mapImage}
                        alt="Hand-drawn map artwork, symbolizing a map in progress"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </section>
              </div>
              <section className="start-here">
                <div className="start-here-inner">
                  <div className="start-here-header">
                    <div>
                      <span className="start-here-eyebrow">A path into the library</span>
                      <h2 className="start-here-heading">Start here</h2>
                      <p>Begin with the first essay published in each field of inquiry.</p>
                    </div>
                  </div>
                  {featuredEssays.length > 0 && (
                    <div className="start-here-carousel">
                      <Link
                        key={featuredEssays[startHereIndex].slug}
                        to={`/library/${featuredEssays[startHereIndex].section}/${featuredEssays[startHereIndex].slug}`}
                        className="feature-card feature-card-slide"
                      >
                        <div className="feature-card-image">
                          <img
                            src={getImageUrl(featuredEssays[startHereIndex])}
                            alt={featuredEssays[startHereIndex].title}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="feature-card-body">
                          <span className="feature-card-meta">
                            {featuredEssays[startHereIndex].section} · {formatDate(featuredEssays[startHereIndex].date)}
                          </span>
                          <h3>{featuredEssays[startHereIndex].title}</h3>
                          <p>{featuredEssays[startHereIndex].excerpt}</p>
                          <span className="feature-card-link">Read the essay →</span>
                        </div>
                      </Link>
                      <div className="start-here-controls" aria-label="Start here essays">
                        <button
                          type="button"
                          className="previous"
                          onClick={() => setStartHereIndex((index) => (index - 1 + featuredEssays.length) % featuredEssays.length)}
                          aria-label="Previous essay"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          className="next"
                          onClick={() => setStartHereIndex((index) => (index + 1) % featuredEssays.length)}
                          aria-label="Next essay"
                        >
                          ›
                        </button>
                      </div>
                      <div className="start-here-dots" aria-label="Choose an essay">
                        {featuredEssays.map((essay, index) => (
                          <button
                            key={essay.slug}
                            type="button"
                            className={index === startHereIndex ? 'active' : ''}
                            onClick={() => setStartHereIndex(index)}
                            aria-label={`Show ${essay.title}`}
                            aria-current={index === startHereIndex ? 'true' : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          } />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:section" element={<Library />} />
          <Route path="/library/:section/:slug" element={<Library />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <nav className="footer-links" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/library">Library</Link>
            <a href="mailto:edelmann.toshi@gmail.com">Email</a>
          </nav>
          <p>&copy; {new Date().getFullYear()} Independently Thinking Human</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
