import { Link } from 'react-router-dom';

const skills = ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'HTML/CSS', 'Git'];

export default function Home() {
  return (
    <section className="home">
      <div className="hero">
        <p className="hero-kicker">Computer Science student · Shenyang Normal University</p>
        <h1>
          Hi, I'm <span>Zining Zhang</span>
        </h1>
        <p className="hero-sub">
          I build small full-stack web applications and keep notes on what I learn along the way.
          This site shows my course projects on the Projects page and my writing on the Blog page.
        </p>
        <div className="hero-actions">
          <Link to="/projects" className="btn-primary">View my projects</Link>
          <Link to="/contact" className="btn-secondary">Get in touch</Link>
        </div>
      </div>

      <div className="about-grid">
        <div className="card">
          <h2>About me</h2>
          <p>
            I am a third-year student majoring in Computer Science and Technology (Sino-foreign
            cooperation programme). My coursework covers web data management, databases and
            backend development, and I enjoy turning small ideas into working pages and APIs.
          </p>
        </div>
        <div className="card">
          <h2>Skills I practise</h2>
          <ul className="tag-list">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
