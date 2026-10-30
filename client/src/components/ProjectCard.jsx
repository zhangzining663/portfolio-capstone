export default function ProjectCard({ project }) {
  return (
    <article className="card project-card">
      {project.imageUrl && (
        <img className="project-thumb" src={project.imageUrl} alt={project.title} />
      )}
      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="card-links">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">Code</a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo</a>
          )}
        </div>
      </div>
    </article>
  );
}
