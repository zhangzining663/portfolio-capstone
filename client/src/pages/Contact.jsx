import { useState } from 'react';
import { apiRequest } from '../api/client.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSent(false);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in every field');
      return;
    }

    setSending(true);
    try {
      await apiRequest('/api/contact', { method: 'POST', body: form });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="page narrow">
      <h1 className="page-title">Contact</h1>
      <p className="page-lede">Have a project in mind or a question about my work? Send a message below.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={update} placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" />
        </label>
        <label>
          Message
          <textarea name="message" rows={6} value={form.message} onChange={update} placeholder="What would you like to say?" />
        </label>
        {error && <p className="status error">{error}</p>}
        {sent && <p className="status ok">Thanks! Your message has been sent successfully.</p>}
        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </section>
  );
}
