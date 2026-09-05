import { Link } from 'react-router-dom';
import { getLatestPosts } from '../utils/libraryLoader';
import { LibraryPost } from '../components/LibraryPost';
import './Home.css';

const latestPosts = getLatestPosts(3);

const Home = () => (
  <>
    <section className="home-hero">
      <div className="home-hero-inner">
        <h1 className="home-title">Independently<br />Thinking Human.</h1>
        <p className="home-tagline">
          Long-form essays on balancing order and chaos while navigating
          through life's complexities.
        </p>
        <Link to="/library" className="btn">Browse the library</Link>
      </div>
    </section>

    <section className="home-latest">
      <h2 className="section-heading">Latest essays</h2>
      <div className="home-latest-grid">
        {latestPosts.map(post => (
          <LibraryPost
            key={post.slug}
            post={post}
            isPreview
            section={post.section}
            cardStyle="horizontal"
            showSectionHeading
          />
        ))}
      </div>
    </section>

    <section className="home-about-teaser">
      <h2 className="section-heading">The first principle</h2>
      <p>
        We build routines, create stability, and carve out spaces of comfort.
        But no matter how carefully we arrange our world, order is always
        temporary — chaos returns, demanding to be faced.
      </p>
      <Link to="/about">Read more about the project</Link>
    </section>
  </>
);

export default Home;
