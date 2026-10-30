import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

export default function BlogDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSent, setCommentSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiRequest(`/api/blog/${id}`)
      .then((data) => setPost(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    setCommentError('');
    setCommentSent(false);
    if (!draft.trim()) {
      setCommentError('Please write a comment first');
      return;
    }
    try {
      const fresh = await apiRequest(`/api/blog/${id}/comments`, {
        method: 'POST',
        body: { body: draft },
        token
      });
      setPost((prev) => ({ ...prev, comments: [...(prev.comments || []), fresh] }));
      setDraft('');
      setCommentSent(true);
    } catch (err) {
      setCommentError(err.message);
    }
  }

  return (
    <section className="page detail-page">
      <StatusMessage loading={loading} error={error}>
        {post && (
          <>
            <Link to="/blog" className="back-link">← Back to all posts</Link>
            <h1 className="page-title">{post.title}</h1>
            <p className="blog-meta">
              by {post.author?.username || 'unknown'} ·{' '}
              {new Date(post.createdAt).toLocaleString('en-US')}
            </p>
            <div className="post-content">{post.content}</div>

            <h2 className="section-sub">Comments ({post.comments?.length || 0})</h2>
            <div className="comment-list">
              {(!post.comments || post.comments.length === 0) && (
                <p className="empty-hint">Be the first to comment.</p>
              )}
              {post.comments?.map((c) => (
                <div className="comment" key={c._id}>
                  <p className="comment-author">{c.author?.username || 'user'}</p>
                  <p className="comment-body">{c.body}</p>
                  <p className="comment-time">
                    {new Date(c.createdAt).toLocaleString('en-US')}
                  </p>
                </div>
              ))}
            </div>

            {token ? (
              <form className="form comment-form" onSubmit={submitComment}>
                <h3>Leave a comment</h3>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                {commentError && <p className="status error">{commentError}</p>}
                {commentSent && <p className="status ok">Comment posted.</p>}
                <button type="submit" className="btn-primary">Post comment</button>
              </form>
            ) : (
              <p className="empty-hint">
                Please <Link to="/login">log in</Link> to write a comment.
              </p>
            )}
          </>
        )}
      </StatusMessage>
    </section>
  );
}
