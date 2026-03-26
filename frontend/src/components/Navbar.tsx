import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, username, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.brand}>
        <Link to="/">User Management</Link>
      </div>
      <ul className={styles.links}>
        {role === 'ADMIN' && (
          <li>
            <Link to="/users">Users</Link>
          </li>
        )}
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className={styles.user}>
        <span aria-label={`Logged in as ${username}`}>{username} ({role})</span>
        <button onClick={handleLogout} aria-label="Logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
