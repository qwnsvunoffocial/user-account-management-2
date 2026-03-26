import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { editUserSchema } from '../utils/validation';
import { getUserById, updateUser } from '../services/userService';
import { UpdateUserPayload, User } from '../types/User';
import { useAuth } from '../hooks/useAuth';

interface EditFormData {
  username?: string;
  email?: string;
  password?: string;
}

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const backPath = currentUser?.role === 'ADMIN' ? '/users' : '/profile';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: yupResolver(editUserSchema),
  });

  useEffect(() => {
    if (!id) {
      setLoadError('Nieprawidłowy identyfikator użytkownika.');
      setLoading(false);
      return;
    }
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      setLoadError('Nieprawidłowy identyfikator użytkownika.');
      setLoading(false);
      return;
    }
    getUserById(userId)
      .then((data) => {
        setUserData(data);
        reset({
          username: data.username,
          email: data.email,
          password: '',
        });
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
        setLoadError('Nie udało się załadować danych użytkownika.');
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: EditFormData) => {
    if (!id || !userData) return;
    setServerError(null);
    setSuccessMessage(null);

    const payload: UpdateUserPayload = {};
    if (data.username && data.username !== userData.username) payload.username = data.username;
    if (data.email && data.email !== userData.email) payload.email = data.email;
    if (data.password && data.password.trim() !== '') payload.password = data.password;

    if (Object.keys(payload).length === 0) {
      setServerError('Nie wprowadzono żadnych zmian.');
      return;
    }

    try {
      const updated = await updateUser(parseInt(id, 10), payload);
      setUserData(updated);
      setSuccessMessage('Dane użytkownika zostały zaktualizowane.');
      reset({
        username: updated.username,
        email: updated.email,
        password: '',
      });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setServerError(
        axiosError.response?.data?.message ?? 'Aktualizacja nie powiodła się. Spróbuj ponownie.'
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container" aria-live="polite" aria-busy="true">
        <div className="loading-spinner" aria-hidden="true" />
        <span>Ładowanie danych użytkownika...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-container">
        <div className="alert alert-error" role="alert">{loadError}</div>
        <Link to={backPath} className="btn btn-secondary" style={{ width: 'auto' }}>
          ← Wróć
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Edytuj użytkownika</h1>
        <Link to={backPath} className="btn btn-secondary btn-sm" style={{ width: 'auto' }}>
          ← Wróć
        </Link>
      </div>

      {userData && (
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Edytujesz konto: <strong>{userData.username}</strong> ({userData.email})
        </p>
      )}

      {successMessage && (
        <div className="alert alert-success" role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          {serverError}
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formularz edycji użytkownika">
          <div className="form-group">
            <label htmlFor="edit-username" className="form-label">
              Nazwa użytkownika
            </label>
            <input
              id="edit-username"
              type="text"
              className={`form-input${errors.username ? ' error' : ''}`}
              aria-describedby={errors.username ? 'edit-username-error' : undefined}
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <p id="edit-username-error" className="form-error" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-email" className="form-label">
              Adres email
            </label>
            <input
              id="edit-email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              aria-describedby={errors.email ? 'edit-email-error' : undefined}
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p id="edit-email-error" className="form-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-password" className="form-label">
              Nowe hasło <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>(opcjonalnie)</span>
            </label>
            <input
              id="edit-password"
              type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              aria-describedby={errors.password ? 'edit-password-error' : 'edit-password-hint'}
              autoComplete="new-password"
              placeholder="Pozostaw puste, aby nie zmieniać"
              {...register('password')}
            />
            {errors.password ? (
              <p id="edit-password-error" className="form-error" role="alert">
                {errors.password.message}
              </p>
            ) : (
              <p id="edit-password-hint" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Min. 8 znaków, jedna cyfra i jedna wielka litera
              </p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: 'auto' }}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
            <Link to={backPath} className="btn btn-secondary" style={{ width: 'auto' }}>
              Anuluj
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
