import { useEffect, useState } from 'react';

export default function Feed({ token, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/auth/feed?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load feed');
        return res.json();
      })
      .then((data) => setPosts(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={styles.center}>Loading your feed...</div>;
  if (error) return <div style={styles.center}>Error: {error}</div>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>My Instagram Feed</h1>
        <button onClick={onLogout} style={styles.logoutBtn}>
          Disconnect
        </button>
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
            {post.media_type === 'VIDEO' ? (
              <video
                src={post.media_url}
                poster={post.thumbnail_url}
                style={styles.media}
              />
            ) : (
              <img src={post.media_url} alt={post.caption || ''} style={styles.media} />
            )}
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
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid #efefef',
    marginBottom: 32,
  },
  headerTitle: { fontSize: 22, fontWeight: 700 },
  logoutBtn: {
    background: 'none',
    border: '1px solid #dbdbdb',
    borderRadius: 8,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
  },
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
