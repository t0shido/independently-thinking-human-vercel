import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="default-page">
    <div className="content-wrapper">
      <h1>Page not found</h1>
      <p className="subtitle">
        This page doesn't exist — it may have moved, or never did.
      </p>
      <p className="subtitle">
        <Link to="/">Back home</Link>
        {' · '}
        <Link to="/library">Browse the library</Link>
      </p>
    </div>
  </div>
);

export default NotFound;
