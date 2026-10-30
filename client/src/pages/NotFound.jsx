import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page narrow center">
      <h1 className="page-title">404</h1>
      <p className="page-lede">This page does not exist.</p>
      <Link to="/" className="btn-primary">Back home</Link>
    </section>
  );
}
