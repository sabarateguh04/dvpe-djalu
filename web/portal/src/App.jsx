import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ReportWizard from './pages/ReportWizard.jsx';
import StatusCheck from './pages/StatusCheck.jsx';
import PanicPage from './pages/PanicPage.jsx';
import Placeholder from './pages/Placeholder.jsx';
import { navGroups } from './nav.js';

const builtPages = { '': true, lapor: true, status: true, panic: true };
const otherRoutes = navGroups.flatMap((g) => g.items).filter((i) => !(i.to in builtPages));

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="lapor" element={<ReportWizard />} />
        <Route path="status" element={<StatusCheck />} />
        <Route path="panic" element={<PanicPage />} />
        {otherRoutes.map((r) => (
          <Route key={r.to} path={r.to} element={<Placeholder />} />
        ))}
      </Route>
    </Routes>
  );
}
