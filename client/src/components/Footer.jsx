export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <p>© {year} Zining Zhang · Built with React, Express and MongoDB for the Web Data Management course.</p>
    </footer>
  );
}
