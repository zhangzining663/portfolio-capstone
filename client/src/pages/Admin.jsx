import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminProjects from '../components/admin/AdminProjects.jsx';
import AdminBlog from '../components/admin/AdminBlog.jsx';

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('projects');

  return (
    <section className="page">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-lede">
        Welcome back, {user?.username}. Use the tabs below to manage projects and blog posts.
      </p>

      <div className="tab-bar">
        <button className={tab === 'projects' ? 'tab active' : 'tab'} onClick={() => setTab('projects')}>
          Projects
        </button>
        <button className={tab === 'blog' ? 'tab active' : 'tab'} onClick={() => setTab('blog')}>
          Blog Posts
        </button>
      </div>

      {tab === 'projects' ? <AdminProjects /> : <AdminBlog />}
    </section>
  );
}
