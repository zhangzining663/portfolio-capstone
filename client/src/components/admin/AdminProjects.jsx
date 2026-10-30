import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

const blank = { title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '' };

export default function AdminProjects() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await apiRequest('/api/projects');
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
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || '',
      repoUrl: item.repoUrl || '',
      liveUrl: item.liveUrl || ''
    });
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
        await apiRequest(`/api/projects/${editingId}`, { method: 'PUT', body: form, token });
        setMessage('Project updated');
      } else {
        await apiRequest('/api/projects', { method: 'POST', body: form, token });
        setMessage('Project created');
      }
      resetForm();
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(id) {
    try {
      await apiRequest(`/api/projects/${id}`, { method: 'DELETE', token });
      setMessage('Project deleted');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <form className="form admin-form" onSubmit={save}>
        <h3>{editingId ? 'Edit project' : 'Add a new project'}</h3>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          placeholder="Repository URL (optional)"
          value={form.repoUrl}
          onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
        />
        <input
          placeholder="Live demo URL (optional)"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
        />
        <div className="form-row-buttons">
          <button type="submit" className="btn-primary">
            {editingId ? 'Save changes' : 'Create project'}
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
                <span className="admin-sub">{p.description}</span>
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
