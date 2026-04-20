export default function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>My Instagram Feed</h1>
        <p style={styles.subtitle}>Connect your Instagram account to view your posts</p>
        <a href="http://localhost:3001/auth/instagram" style={styles.button}>
          Connect Instagram
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    maxWidth: 360,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 12,
  },
  subtitle: {
    color: '#666',
    marginBottom: 32,
    lineHeight: 1.5,
  },
  button: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    color: '#fff',
    padding: '14px 32px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16,
  },
};
