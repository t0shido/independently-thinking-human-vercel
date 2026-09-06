import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import './App.css';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import MobileNav from './components/MobileNav';
import homeContent from '../content/home/intro.json';

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
            <div className={`content-section ${isVisible ? 'visible' : ''}`}>
              <section className="featured-posts">
                <div className="intro-text">
                  <h1>{homeContent.title}</h1>
                  {homeContent.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  <Link to="/library" className="intro-link">Explore the library →</Link>
                </div>
              </section>
            </div>
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
