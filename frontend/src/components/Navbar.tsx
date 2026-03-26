import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = memo(() => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" aria-label="Nawigacja główna">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          User Management
        </Link>
        <ul className="navbar-nav" role="list">
          {user?.role === 'ADMIN' && (
            <li>
              <Link to="/users" className="navbar-link">
                Użytkownicy
              </Link>
            </li>
          )}
          {user?.role === 'USER' && (
            <li>
              <Link to="/profile" className="navbar-link">
                Profil
              </Link>
            </li>
          )}
          <li>
            <button
              className="navbar-button"
              onClick={logout}
              type="button"
              aria-label="Wyloguj się"
            >
              Wyloguj
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
