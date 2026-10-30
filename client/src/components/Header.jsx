import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">Zining<span>.dev</span></Link>
        <nav className="main-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user ? (
            <>
              <NavLink to="/admin" className="nav-admin">Dashboard</NavLink>
              <button className="btn-plain" onClick={handleLogout}>Logout ({user.username})</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="nav-register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
