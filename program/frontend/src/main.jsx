import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Route, Routes } from "react-router";

const RegisterPage = lazy(() => import("./pages/Register.jsx"));
const LoginPage = lazy(() => import("./pages/Login.jsx"));

const HomePage = lazy(() => import("./pages/Home.jsx"));
const ProjektekPage = lazy(() => import("./pages/Projektek.jsx"));
const MunkatarsakPage = lazy(() => import("./pages/Munkatarsak.jsx"));
const DokumentumokPage = lazy(() => import("./pages/Dokumentumok.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="text-center mt-5 text-white">Betöltés...</div>
        }
      >
        <Routes>
          <Route element={<HomePage />} path="/Vezerlopult" />
          <Route element={<ProjektekPage />} path="/Projektek" />
          <Route element={<MunkatarsakPage />} path="/Munkatarsak" />
          <Route element={<DokumentumokPage />} path="/Dokumentumok" />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
