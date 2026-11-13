import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import AuthProvider from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import './styles.css';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Projektek = lazy(() => import('./pages/Projektek'));
const Munkatarsak = lazy(() => import('./pages/Munkatarsak'));
const Dokumentumok = lazy(() => import('./pages/Dokumentumok'));

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><AuthProvider><Suspense fallback={<div className="page-status" role="status">Betöltés…</div>}><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/adatvedelem" element={<Privacy />} />
    <Route path="/bejelentkezes" element={<Navigate to="/login" replace />} />
    <Route path="/regisztracio" element={<Navigate to="/register" replace />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/Vezerlopult" element={<Home />} />
      <Route path="/Projektek" element={<Projektek />} />
      <Route path="/Munkatarsak" element={<Munkatarsak />} />
      <Route path="/Dokumentumok" element={<Dokumentumok />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes></Suspense></AuthProvider></BrowserRouter></StrictMode>,
);
