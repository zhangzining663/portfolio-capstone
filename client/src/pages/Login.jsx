import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page narrow">
      <h1 className="page-title">Login</h1>
      <form className="form" onSubmit={submit}>
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
          {busy ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p className="form-switch">
        No account yet? <Link to="/register">Register here</Link>
      </p>
    </section>
  );
}
