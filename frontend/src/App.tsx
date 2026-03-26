import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const EditUserPage = lazy(() => import('./pages/EditUserPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === 'ADMIN') {
    return <Navigate to="/users" replace />;
  }
  return <Navigate to="/profile" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1rem', color: '#64748b' }}>Ładowanie...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:id/edit" element={<EditUserPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
