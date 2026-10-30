import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

const blank = { title: '', content: '' };

export default function AdminBlog() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await apiRequest('/api/blog');
      setItems(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item) {
    setEditingId(item._id);
    setForm({ title: item.title, content: item.content });
  }

  function resetForm() {
    setEditingId(null);
    setForm(blank);
    setMessage('');
  }

  async function save(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await apiRequest(`/api/blog/${editingId}`, { method: 'PUT', body: form, token });
        setMessage('Post updated');
      } else {
        await apiRequest('/api/blog', { method: 'POST', body: form, token });
        setMessage('Post created');
      }
      resetForm();
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(id) {
    try {
      await apiRequest(`/api/blog/${id}`, { method: 'DELETE', token });
      setMessage('Post deleted');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <form className="form admin-form" onSubmit={save}>
        <h3>{editingId ? 'Edit post' : 'Write a new post'}</h3>
        <input
          placeholder="Post title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          rows={6}
          placeholder="Post content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <div className="form-row-buttons">
          <button type="submit" className="btn-primary">
            {editingId ? 'Save changes' : 'Publish post'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p className="status ok">{message}</p>}
      {loading ? (
        <p className="status loading">Loading…</p>
      ) : (
        <ul className="admin-list">
          {items.map((p) => (
            <li key={p._id}>
              <div>
                <strong>{p.title}</strong>
                <span className="admin-sub">
                  {new Date(p.createdAt).toLocaleDateString('en-US')}
                </span>
              </div>
              <div className="admin-actions">
                <button onClick={() => startEdit(p)}>Edit</button>
                <button className="danger" onClick={() => remove(p._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
