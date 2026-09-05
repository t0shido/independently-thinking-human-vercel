import './About.css';
import content from '../../content/home/intro.json';
import heroImage from '../../content/home/chaos_and_order.webp';

const About = () => {
  const paragraphs = content.content.split('\n\n');
  const beforeImage = paragraphs.slice(0, 3);
  const afterImage = paragraphs.slice(3);

  return (
    <article className="about-page">
      <div className="intro-text">
        <h1>{content.title}</h1>
        {beforeImage.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <div className="hero-image-container">
          <img
            src={heroImage}
            alt="Balance of chaos and order"
            className="hero-image"
            width="709"
            height="397"
            decoding="async"
          />
        </div>
        {afterImage.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="about-meta">
        <h2 className="section-heading">About</h2>
        <p>
          Independently Thinking Human is an essay project by Toshi, exploring
          how order and chaos shape mindset, politics, economics, technology,
          and the stories we live.
        </p>
        <p>
          Get in touch:{' '}
          <a href="mailto:edelmann.toshi@gmail.com">edelmann.toshi@gmail.com</a>
        </p>
      </div>
    </article>
  );
};

export default About;
