import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Feed from './components/Feed.jsx';

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check URL for token after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('ig_token', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, '', '/');
    } else {
      const stored = localStorage.getItem('ig_token');
      if (stored) setToken(stored);
    }
  }, []);

  function logout() {
    localStorage.removeItem('ig_token');
    setToken(null);
  }

  return token ? <Feed token={token} onLogout={logout} /> : <Login />;
}
