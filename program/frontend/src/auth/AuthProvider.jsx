import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../lib/api';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async (signal) => {
    setLoading(true); setError('');
    try { setUser((await api('/me', { signal })).user); }
    catch (err) {
      if (err.name === 'AbortError') return;
      if (err.status === 401) setUser(null);
      else setError(err.message);
    } finally { if (!signal?.aborted) setLoading(false); }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);
  const authenticate = async (path, body) => {
    const data = await api(path, { method: 'POST', body: JSON.stringify(body) });
    setUser(data.user); setError('');
  };
  const logout = async () => { await api('/logout', { method: 'POST' }); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, error, reload, authenticate, logout }}>{children}</AuthContext.Provider>;
}
