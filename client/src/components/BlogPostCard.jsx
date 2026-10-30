import { Link } from 'react-router-dom';

export default function BlogPostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className="card blog-card">
      <Link to={`/blog/${post._id}`} className="blog-link">
        <h3>{post.title}</h3>
      </Link>
      <p className="blog-meta">by {post.author?.username || 'unknown'} · {date}</p>
      <p className="blog-excerpt">
        {post.content.length > 140 ? post.content.slice(0, 140) + '…' : post.content}
      </p>
      <Link to={`/blog/${post._id}`} className="read-more">Read more →</Link>
    </article>
  );
}
