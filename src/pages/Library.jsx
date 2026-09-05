import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { getSectionPosts } from '../utils/libraryLoader';
import { LibraryPost } from '../components/LibraryPost';
import LibraryMobileNav from '../components/LibraryMobileNav';
import { getImageUrl } from '../utils/imageUtils';
import config from '../config';
import './Library.css';

const LibrarySection = ({ section }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { slug } = useParams();
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const sectionPosts = await getSectionPosts(section);
        // Sort by date (newest first)
        const reorderedPosts = sectionPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(reorderedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [section]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  if (loading) {
    return <div className="library-content">
      <div className="loading-message">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="library-content">
      <div className="error-message">{error}</div>
    </div>;
  }

  if (slug) {
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      return <div className="library-content">
        <div className="error-message">Post not found</div>
      </div>;
    }
    return <LibraryPost post={post} section={section} />;
  }

  if (posts.length === 0) {
    return <div>No posts found in this section.</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);
  const featuredPost = currentPage === 1 ? currentPosts[0] : null;
  const secondaryPosts = currentPage === 1 ? currentPosts.slice(1) : currentPosts;

  return (
    <>
      <div className="overview-grid">
        {featuredPost && (
          <div className="featured-section">
            <Link to={`/library/${section}/${featuredPost.slug}`} className="book-card large">
              <div className="book-cover">
                {featuredPost.image && (
                  <img 
                    src={getImageUrl(featuredPost, section)}
                    alt={featuredPost.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                )}
              </div>
              <div className="card-content">
                <h2>Featured in {section.charAt(0).toUpperCase() + section.slice(1)}</h2>
                <h3>{featuredPost.title}</h3>
                <p className="description">{featuredPost.excerpt}</p>
                <p className="author">By {featuredPost.author}</p>
                {!isMobile && <p className="category">{featuredPost.tags?.join(', ')}</p>}
              </div>
            </Link>
          </div>
        )}
        <div className="secondary-section">
          {secondaryPosts.map(post => (
            <LibraryPost 
              key={post.slug} 
              post={post} 
              isPreview={true} 
              section={section} 
            />
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &lt;
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
};

const Overview = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);
  
  // Function to fetch articles from each section
  const fetchAllSectionArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get sections from config
      const sections = config.content.sections;
      
      // Fetch articles from each section using the same function as LibrarySection
      const sectionPromises = sections.map(async (section) => {
        try {
          const articles = await getSectionPosts(section, { forceRefresh: true });
          // Add section to each article (getSectionPosts might not include it)
          return articles.map(article => ({
            ...article,
            section
          }));
        } catch (error) {
          console.error(`Error fetching ${section} articles:`, error);
          return [];
        }
      });
      
      // Wait for all fetches to complete
      const sectionResults = await Promise.all(sectionPromises);
      
      // Combine all articles into a single array
      const allArticles = sectionResults.flat();
      
      // Sort by date (newest first)
      const sortedArticles = allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Store all articles for pagination
      setFeaturedArticles(sortedArticles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again.');
      setLoading(false);
    }
  };
  
  // Fetch articles when component mounts
  useEffect(() => {
    fetchAllSectionArticles();
    
    // Set up polling to refresh articles every 30 seconds
    const intervalId = setInterval(fetchAllSectionArticles, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  if (loading) {
    return <div className="loading-message">Loading featured articles...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (featuredArticles.length === 0) {
    return <div className="loading-message">No articles found.</div>;
  }
  
  // Pagination logic
  const totalPages = Math.ceil(featuredArticles.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = featuredArticles.slice(startIndex, endIndex);
  const featuredArticle = currentPage === 1 ? currentPosts[0] : null;
  const otherArticles = currentPage === 1 ? currentPosts.slice(1) : currentPosts;

  return (
    <>
      <div className="overview-grid">
        {featuredArticle && (
          <div className="featured-section">
            <Link to={`/library/${featuredArticle.section}/${featuredArticle.slug}`} className="book-card large">
              <div className="book-cover">
                {featuredArticle.image && (
                  <img 
                    src={getImageUrl(featuredArticle)}
                    alt={featuredArticle.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                )}
              </div>
              <div className="card-content">
                <h2>Featured in {featuredArticle.section.charAt(0).toUpperCase() + featuredArticle.section.slice(1)}</h2>
                <h3>{featuredArticle.title}</h3>
                <p className="description">{featuredArticle.excerpt}</p>
                <p className="author">By {featuredArticle.author}</p>
                {!isMobile && <p className="category">{featuredArticle.tags?.join(', ')}</p>}
              </div>
            </Link>
          </div>
        )}
        <div className="secondary-section">
          {otherArticles.map(post => (
            <LibraryPost 
              key={post.slug} 
              post={post} 
              isPreview={true} 
              section={post.section}
              cardStyle="large"
              showSectionHeading={true}
            />
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &lt;
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
};

const Library = () => {
  const location = useLocation();
  const { section } = useParams();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`library-container ${isMobile ? 'mobile-view' : ''}`}>
      <nav className={`library-nav ${isMobile ? 'mobile-view' : ''}`}>
        {isMobile ? (
          <LibraryMobileNav />
        ) : (
          <div className="library-nav-links">
            <Link to="/library" className={isActive('/library') ? 'active' : ''}>Overview</Link>
            <Link to="/library/mindset" className={section === 'mindset' ? 'active' : ''}>Mindset</Link>
            <Link to="/library/politics" className={section === 'politics' ? 'active' : ''}>Politics</Link>
            <Link to="/library/economics" className={section === 'economics' ? 'active' : ''}>Economics</Link>
            <Link to="/library/technology" className={section === 'technology' ? 'active' : ''}>Technology</Link>
            <Link to="/library/stories" className={section === 'stories' ? 'active' : ''}>Stories</Link>
          </div>
        )}
      </nav>
      
      <div className="library-content">
        {!section ? <Overview /> : <LibrarySection section={section} />}
      </div>
    </div>
  );
};

export default Library;