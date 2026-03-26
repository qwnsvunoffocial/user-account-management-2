import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { LoginFormData } from '../types';
import styles from './AuthForm.module.css';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginService(data);
      login(response.token, response.username, response.role);
      if (response.role === 'ADMIN') {
        navigate('/users');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <main className={styles.container}>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Login form"
      >
        <h1>Login</h1>

        {errors.root && (
          <div className={styles.errorBanner} role="alert">
            {errors.root.message}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            aria-required="true"
            aria-describedby={errors.username ? 'username-error' : undefined}
            {...register('username')}
          />
          {errors.username && (
            <span id="username-error" className={styles.error} role="alert">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-required="true"
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <span id="password-error" className={styles.error} role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>

        <p className={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
