import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import CaseList from './pages/CaseList.jsx';
import AuditLog from './pages/AuditLog.jsx';
import Placeholder from './pages/Placeholder.jsx';
import { navGroups } from './nav.js';

const builtPages = { '': DashboardHome, kasus: CaseList, 'audit-log': AuditLog };
const otherRoutes = navGroups
  .flatMap((g) => g.items)
  .filter((i) => !(i.to in builtPages));

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
        <Route index element={<DashboardHome />} />
        <Route path="kasus" element={<CaseList />} />
        <Route path="audit-log" element={<AuditLog />} />
        {otherRoutes.map((r) => (
          <Route key={r.to} path={r.to} element={<Placeholder />} />
        ))}
      </Route>
    </Routes>
  );
}
