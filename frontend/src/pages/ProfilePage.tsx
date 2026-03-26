import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editUserSchema } from '../utils/validation';
import { getUserById, updateUser } from '../services/userService';
import { User, UpdateUserPayload } from '../types/User';
import { useAuth } from '../hooks/useAuth';

interface ProfileFormData {
  username?: string;
  email?: string;
  password?: string;
}

const ProfilePage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(editUserSchema),
  });

  useEffect(() => {
    if (!currentUser?.id) {
      // If no id in user info, we cannot fetch - show profile from local storage
      setLoading(false);
      return;
    }
    getUserById(currentUser.id)
      .then((data) => {
        setUserData(data);
        reset({
          username: data.username,
          email: data.email,
          password: '',
        });
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setLoadError('Nie udało się załadować profilu.');
      })
      .finally(() => setLoading(false));
  }, [currentUser?.id, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userData && !currentUser) return;
    setServerError(null);
    setSuccessMessage(null);

    const userId = userData?.id ?? currentUser?.id;
    if (!userId) {
      setServerError('Nie można zidentyfikować użytkownika.');
      return;
    }

    const payload: UpdateUserPayload = {};
    if (data.username && data.username !== userData?.username) payload.username = data.username;
    if (data.email && data.email !== userData?.email) payload.email = data.email;
    if (data.password && data.password.trim() !== '') payload.password = data.password;

    if (Object.keys(payload).length === 0) {
      setServerError('Nie wprowadzono żadnych zmian.');
      return;
    }

    try {
      const updated = await updateUser(userId, payload);
      setUserData(updated);
      setSuccessMessage('Profil został zaktualizowany.');
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
        <span>Ładowanie profilu...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-container">
        <div className="alert alert-error" role="alert">{loadError}</div>
      </div>
    );
  }

  const displayName = userData?.username ?? currentUser?.username ?? '—';
  const displayEmail = userData?.email ?? '—';
  const displayRole = userData?.role ?? currentUser?.role ?? '—';
  const displayDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mój profil</h1>
      </div>

      <div className="profile-info" aria-label="Informacje o profilu">
        <div className="profile-field">
          <span className="profile-field-label">Użytkownik</span>
          <span className="profile-field-value">{displayName}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field-label">Email</span>
          <span className="profile-field-value">{displayEmail}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field-label">Rola</span>
          <span className="profile-field-value">
            <span className={`badge ${displayRole === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
              {displayRole}
            </span>
          </span>
        </div>
        {userData && (
          <div className="profile-field">
            <span className="profile-field-label">Konto od</span>
            <span className="profile-field-value">{displayDate}</span>
          </div>
        )}
      </div>

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
        <h2 className="form-title" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
          Edytuj profil
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formularz edycji profilu">
          <div className="form-group">
            <label htmlFor="profile-username" className="form-label">
              Nazwa użytkownika
            </label>
            <input
              id="profile-username"
              type="text"
              className={`form-input${errors.username ? ' error' : ''}`}
              aria-describedby={errors.username ? 'profile-username-error' : undefined}
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <p id="profile-username-error" className="form-error" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="profile-email" className="form-label">
              Adres email
            </label>
            <input
              id="profile-email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              aria-describedby={errors.email ? 'profile-email-error' : undefined}
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p id="profile-email-error" className="form-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="profile-password" className="form-label">
              Nowe hasło <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>(opcjonalnie)</span>
            </label>
            <input
              id="profile-password"
              type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              aria-describedby={errors.password ? 'profile-password-error' : 'profile-password-hint'}
              autoComplete="new-password"
              placeholder="Pozostaw puste, aby nie zmieniać"
              {...register('password')}
            />
            {errors.password ? (
              <p id="profile-password-error" className="form-error" role="alert">
                {errors.password.message}
              </p>
            ) : (
              <p id="profile-password-hint" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
