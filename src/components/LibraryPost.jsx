import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { getImageUrl } from '../utils/imageUtils';
import config from '../config';
import './LibraryPost.css';

export const LibraryPost = ({ post, isPreview = false, section, cardStyle = 'horizontal', showSectionHeading = false }) => {
  if (!post) return null;
  
  const imageUrl = getImageUrl(post);

  if (isPreview) {
    return (
      <Link to={`/library/${section}/${post.slug}`} className={`book-card ${cardStyle} ${isMobile ? 'mobile-view' : ''}`}>
        <div className="book-cover">
          {imageUrl && (
            <img 
              src={imageUrl}
              alt={post.title}
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
          {showSectionHeading && section && (
            <h2>Featured in {section.charAt(0).toUpperCase() + section.slice(1)}</h2>
          )}
          <h3>{post.title}</h3>
          <p className="description">{post.excerpt}</p>
          <p className="author">By {post.author}</p>
          {!isMobile && <p className="category">{post.tags?.join(', ')}</p>}
        </div>
      </Link>
    );
  }

  // Full article view
  const contentLines = post.content.split('\n');
  const contentWithoutTitle = contentLines.slice(2).join('\n');
  const paragraphs = contentWithoutTitle.split('\n\n');
  const beforeImage = paragraphs.slice(0, 2).join('\n\n');
  const afterImage = paragraphs.slice(2).join('\n\n');

  return (
    <article className={`library-post ${isMobile ? 'mobile-view' : ''}`}>
      <div className="library-post-content">
        <h1>{post.title}</h1>
        
        <ReactMarkdown>{beforeImage}</ReactMarkdown>
        
        <div className="library-post-image">
          {imageUrl && (
            <img 
              src={imageUrl}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={(e) => {
                console.error(`Failed to load image: ${imageUrl}`);
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>

        <ReactMarkdown>{afterImage}</ReactMarkdown>

        <div className="metadata">
          <p className="author">By {post.author}</p>
          <p className="date">{post.date}</p>
          <p className="tags">Categories: {post.tags?.join(', ')}</p>
        </div>
      </div>
    </article>
  );
};
