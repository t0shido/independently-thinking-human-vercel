import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mobile-nav">
      <button
        className={`hamburger ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMenu} aria-label="Close menu">
          <span></span>
          <span></span>
        </button>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>HOME</Link>
          <Link to="/library" className="mobile-nav-link" onClick={toggleMenu}>LIBRARY</Link>
          <Link to="/about" className="mobile-nav-link" onClick={toggleMenu}>ABOUT</Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
