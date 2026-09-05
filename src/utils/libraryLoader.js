import articles from '../../content/articles.json';

// Articles are committed to the repository and bundled at build time. This keeps
// the public site fully static while retaining the same async loader interface.
const postsBySection = articles.reduce((sections, article) => {
  (sections[article.section] ||= []).push(article);
  return sections;
}, {});

export function getLatestPosts(limit = 3) {
  return [...articles]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

export async function getSectionPosts(section) {
  return [...(postsBySection[section] || [])];
}

export async function getPostBySlug(section, slug) {
  try {
    // First try to get all posts for the section
    const posts = await getSectionPosts(section);
    
    // Find the post with the matching slug
    const post = posts.find(post => post.slug === slug);
    
    if (post) {
      return post;
    } else {
      console.error(`Post with slug ${slug} not found in section ${section}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching post ${slug} from section ${section}:`, error);
    return null;
  }
}
