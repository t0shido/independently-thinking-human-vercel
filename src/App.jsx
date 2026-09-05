import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import MobileNav from './components/MobileNav';
import chaosOrderImage from '../content/home/chaos_and_order.webp';
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
  const [imageScale, setImageScale] = useState(1);

  // Split content into paragraphs
  const paragraphs = homeContent.content.split('\n\n');
  const beforeImage = paragraphs.slice(0, 3).join('\n\n');
  const afterImage = paragraphs.slice(3).join('\n\n');

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

      // Image zoom effect - calculate scale based on scroll position
      const imageElement = document.querySelector('.hero-image-container');
      if (imageElement) {
        const imageTop = imageElement.getBoundingClientRect().top;
        const imageHeight = imageElement.offsetHeight;
        const windowCenter = windowHeight / 2;
        
        // Calculate distance from center of viewport
        const distanceFromCenter = Math.abs(imageTop + imageHeight / 2 - windowCenter);
        const maxDistance = windowHeight;
        
        // Scale from 1.0 to 1.2 based on distance from center
        // Closer to center = larger scale
        const scale = 1.2 - (distanceFromCenter / maxDistance) * 0.2;
        setImageScale(Math.max(1, Math.min(1.2, scale)));
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
        {!isHome && (
          isMobile ? (
            <nav className="nav-menu mobile">
              <MobileNav />
            </nav>
          ) : (
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
            <p style={{ 
              fontSize: isMobile ? '0.9rem' : '1.1rem', 
              opacity: 0.9, 
              letterSpacing: '1px',
              marginLeft: isMobile ? '0rem' : '3rem'
            }}>
              Balancing between Order and Chaos while navigating through Life's Complexities
            </p>
            {!isMobile && (
              <Link to="/library" className="hero-cta">Explore the library</Link>
            )}

            {/* Decorative elements */}
            <div className="decorative-circle size-lg"></div>
            <div className="decorative-circle size-md"></div>
            <div className="decorative-circle size-sm"></div>
          </div>
        )}
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <div className={`content-section ${isVisible ? 'visible' : ''}`}>
              <section className="featured-posts">
                <div className="intro-text" style={{
                  position: 'relative'
                }}>
                  <h1>{homeContent.title}</h1>
                  {beforeImage.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  <div className={`hero-image-container${isMobile ? ' mobile' : ''}`}>
                    <img
                      src={chaosOrderImage}
                      alt="Balance of Chaos and Order"
                      className="hero-image"
                      style={isMobile ? {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        transform: `scale(${imageScale})`,
                        transition: 'transform 1.2s ease-out'
                      } : {
                        transform: `scale(${imageScale})`,
                        transition: 'transform 1.2s ease-out'
                      }}
                    />
                  </div>
                  {afterImage.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
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
      <Analytics />
    </div>
  );
}

export default App;
