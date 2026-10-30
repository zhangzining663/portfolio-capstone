import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import ProjectCard from '../components/ProjectCard.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/projects')
      .then((data) => setProjects(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h1 className="page-title">Projects</h1>
      <StatusMessage loading={loading} error={error}>
        {projects.length === 0 ? (
          <p className="empty-hint">No projects have been published yet.</p>
        ) : (
          <div className="grid projects-grid">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </StatusMessage>
    </section>
  );
}
