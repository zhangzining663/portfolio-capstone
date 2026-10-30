// small shared component so each page shows a consistent loading / error state
export default function StatusMessage({ loading, error, children }) {
  if (loading) return <p className="status loading">Loading…</p>;
  if (error) return <p className="status error">⚠ {error}</p>;
  return children;
}
