import { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/feed')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load feed');
        return res.json();
      })
      .then((data) => setPosts(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.center}>Loading your feed...</div>;
  if (error) return <div style={styles.center}>Error: {error}<br /><small>Check that your .env credentials are correct and the backend is running.</small></div>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>My Instagram Feed</h1>
      </header>

      <div style={styles.grid}>
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            style={styles.card}
          >
            <img
              src={post.image_url || post.media_url}
              alt={post.caption || ''}
              style={styles.media}
            />
            {post.caption && (
              <p style={styles.caption}>
                {post.caption.length > 80
                  ? post.caption.slice(0, 80) + '...'
                  : post.caption}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 960, margin: '0 auto', padding: '0 16px 48px' },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    gap: 8,
  },
  header: {
    padding: '24px 0',
    borderBottom: '1px solid #efefef',
    marginBottom: 32,
  },
  headerTitle: { fontSize: 22, fontWeight: 700 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  media: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' },
  caption: { padding: '12px 16px', fontSize: 13, color: '#444', lineHeight: 1.5 },
};
