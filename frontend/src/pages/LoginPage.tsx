import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../utils/validation';
import { login as loginService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/Auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setServerError(null);
    try {
      const authResponse = await loginService(data);
      login(authResponse);
      if (authResponse.role === 'ADMIN') {
        navigate('/users');
      } else {
        navigate('/profile');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setServerError(
        axiosError.response?.data?.message ?? 'Logowanie nie powiodło się. Sprawdź dane i spróbuj ponownie.'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Zaloguj się</h1>
        <p className="auth-subtitle">Witaj ponownie! Zaloguj się na swoje konto.</p>

        {serverError && (
          <div className="alert alert-error" role="alert" aria-live="assertive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formularz logowania">
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
            <label htmlFor="password" className="form-label">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              aria-required="true"
              aria-describedby={errors.password ? 'password-error' : undefined}
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" className="form-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ marginTop: '8px' }}
          >
            {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <p className="auth-footer">
          Nie masz konta?{' '}
          <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
