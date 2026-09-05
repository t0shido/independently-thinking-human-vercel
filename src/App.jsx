import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Library from './pages/Library';
import About from './pages/About';
import NotFound from './pages/NotFound';
import MobileNav from './components/MobileNav';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <nav className="nav-menu">
            <div className="nav-links">
              <Link to="/" className="nav-link">HOME</Link>
              <Link to="/library" className="nav-link">LIBRARY</Link>
              <Link to="/about" className="nav-link">ABOUT</Link>
            </div>
            <MobileNav />
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:section" element={<Library />} />
            <Route path="/library/:section/:slug" element={<Library />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <nav className="footer-links" aria-label="Footer">
              <Link to="/">Home</Link>
              <Link to="/library">Library</Link>
              <Link to="/about">About</Link>
              <a href="mailto:edelmann.toshi@gmail.com">Email</a>
            </nav>
            <p>&copy; {new Date().getFullYear()} Independently Thinking Human</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
