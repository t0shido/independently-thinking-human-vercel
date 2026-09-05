import config from '../config';

// Utility function to generate image URLs for blog posts
export const getImageUrl = (post) => {
  if (!post.image) return null;
  
  // If image is already a full URL, use it directly
  if (post.image.startsWith('http://') || post.image.startsWith('https://')) {
    return post.image;
  }
  
  // Content images are copied into the static public/library directory.
  if (post.image.startsWith('/')) {
    return post.image;
  }

  return `${config.content.mediaUrl}/${post.image}`;
};
