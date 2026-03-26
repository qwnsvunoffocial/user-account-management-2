import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/userService';
import { User } from '../types';
import styles from './UsersPage.module.css';

const ITEMS_PER_PAGE = 10;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Delete user "${username}"? This action cannot be undone.`)) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Failed to delete user.');
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <main className={styles.container}>
      <h1>Users</h1>

      {loading && <p aria-live="polite">Loading…</p>}
      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <table className={styles.table} aria-label="Users list">
            <caption className={styles.srOnly}>List of all registered users</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Created At</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[user.role.toLowerCase()]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <Link
                        to={`/users/${user.id}/edit`}
                        className={styles.editBtn}
                        aria-label={`Edit ${user.username}`}
                      >
                        Edit
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(user.id, user.username)}
                        aria-label={`Delete ${user.username}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
              >
                ‹ Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                Next ›
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
};

export default UsersPage;
