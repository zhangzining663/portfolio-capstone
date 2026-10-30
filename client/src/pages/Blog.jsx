import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import BlogPostCard from '../components/BlogPostCard.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/blog')
      .then((data) => setPosts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h1 className="page-title">Blog</h1>
      <StatusMessage loading={loading} error={error}>
        {posts.length === 0 ? (
          <p className="empty-hint">No blog posts yet — check back later.</p>
        ) : (
          <div className="grid blog-list">
            {posts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </StatusMessage>
    </section>
  );
}
