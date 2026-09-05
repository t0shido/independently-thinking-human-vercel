import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LibraryMobileNav.css';

const LibraryMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  
  const sections = [
    { path: '', label: 'Overview' },
    { path: 'mindset', label: 'Mindset' },
    { path: 'politics', label: 'Politics' },
    { path: 'economics', label: 'Economics' },
    { path: 'technology', label: 'Technology' },
    { path: 'stories', label: 'Stories' }
  ];

  const currentSection = sections.find(section => 
    section.path === currentPath
  )?.label || sections[0].label;

  return (
    <div className="library-mobile-nav">
      <button 
        className={`dropdown-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select section"
        aria-expanded={isOpen}
      >
        <span className="current-section">{currentSection}</span>
        <span className="dropdown-arrow"></span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {sections
            .filter(section => {
              // If we're on overview (empty path), don't show overview in dropdown
              if (currentPath === '' && section.path === '') return false;
              // For other sections, don't show current section in dropdown
              return section.path !== currentPath;
            })
            .map((section) => (
              <Link
                key={section.path}
                to={`/library/${section.path}`}
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                  border: 'none'
                }}
              >
                {section.label}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default LibraryMobileNav;
