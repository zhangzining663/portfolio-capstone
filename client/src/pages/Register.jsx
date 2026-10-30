import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setBusy(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page narrow">
      <h1 className="page-title">Register</h1>
      <form className="form" onSubmit={submit}>
        <label>
          Username
          <input name="username" value={form.username} onChange={update} />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={update} />
        </label>
        {error && <p className="status error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="form-switch">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </section>
  );
}
