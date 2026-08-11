import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Memuat sesi...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
