import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './AuthContext';
export default function ProtectedRoute() {
  const { user, loading, error, reload } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-status" role="status">Munkamenet ellenőrzése…</div>;
  if (error) return <div className="page-status"><p role="alert">{error}</p><button className="primary-button" onClick={() => reload()}>Újrapróbálás</button></div>;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
