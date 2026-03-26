import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../utils/validation';
import { register as registerService } from '../services/authService';
import { RegisterRequest } from '../types/Auth';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerService({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate('/login', { state: { successMessage: 'Rejestracja zakończona sukcesem! Możesz się teraz zalogować.' } });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setServerError(
        axiosError.response?.data?.message ?? 'Rejestracja nie powiodła się. Spróbuj ponownie.'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Zarejestruj się</h1>
        <p className="auth-subtitle">Utwórz nowe konto, aby zacząć.</p>

        {serverError && (
          <div className="alert alert-error" role="alert" aria-live="assertive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formularz rejestracji">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nazwa użytkownika
            </label>
            <input
              id="username"
              type="text"
              className={`form-input${errors.username ? ' error' : ''}`}
              aria-required="true"
              aria-describedby={errors.username ? 'username-error' : undefined}
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <p id="username-error" className="form-error" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adres email
            </label>
            <input
              id="email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              aria-required="true"
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="form-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              aria-required="true"
              aria-describedby={errors.password ? 'password-error' : 'password-hint'}
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password ? (
              <p id="password-error" className="form-error" role="alert">
                {errors.password.message}
              </p>
            ) : (
              <p id="password-hint" className="form-error" style={{ color: 'var(--color-text-secondary)' }}>
                Min. 8 znaków, jedna cyfra i jedna wielka litera
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Potwierdź hasło
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              aria-required="true"
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="form-error" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ marginTop: '8px' }}
          >
            {isSubmitting ? 'Rejestracja...' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="auth-footer">
          Masz już konto?{' '}
          <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
