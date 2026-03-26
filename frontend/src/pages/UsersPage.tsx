import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import { getUsers, deleteUser } from '../services/userService';

const PAGE_SIZE = 10;

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Nie udało się załadować listy użytkowników.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = useCallback(async (user: User) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć użytkownika "${user.username}"? Tej operacji nie można cofnąć.`
    );
    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      const newTotalPages = Math.ceil((users.length - 1) / PAGE_SIZE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Nie udało się usunąć użytkownika.');
    }
  }, [users, currentPage]);

  const handleEdit = useCallback((userId: number) => {
    navigate(`/users/${userId}/edit`);
  }, [navigate]);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Zarządzanie użytkownikami</h1>
        <span className="pagination-info">
          Łącznie: {users.length} użytkowników
        </span>
      </div>

      {error && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container" aria-live="polite" aria-busy="true">
          <div className="loading-spinner" aria-hidden="true" />
          <span>Ładowanie użytkowników...</span>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table" aria-label="Lista użytkowników">
              <caption>Lista wszystkich użytkowników w systemie</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nazwa użytkownika</th>
                  <th scope="col">Email</th>
                  <th scope="col">Rola</th>
                  <th scope="col">Data utworzenia</th>
                  <th scope="col">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '32px' }}>
                      Brak użytkowników do wyświetlenia.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <strong>{user.username}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(user.id)}
                            aria-label={`Edytuj użytkownika ${user.username}`}
                            type="button"
                          >
                            Edytuj
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user)}
                            aria-label={`Usuń użytkownika ${user.username}`}
                            type="button"
                          >
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination" aria-label="Paginacja">
              <span className="pagination-info">
                Strona {currentPage} z {totalPages} (wyświetlono {paginatedUsers.length} z {users.length})
              </span>
              <div className="pagination-controls">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Poprzednia strona"
                  type="button"
                >
                  ← Poprzednia
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Następna strona"
                  type="button"
                >
                  Następna →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
