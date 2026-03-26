import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUserById, updateUser } from '../services/userService';
import { UpdateUserFormData } from '../types';
import styles from './AuthForm.module.css';
import editStyles from './EditUserPage.module.css';

type EditFormValues = {
  username?: string;
  email?: string;
  password?: string;
};

const schema: yup.ObjectSchema<EditFormValues> = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  email: yup.string().email('Invalid email format'),
  password: yup
    .string()
    .test(
      'password-optional',
      'Password must be at least 8 characters, contain an uppercase letter and a digit',
      (value) => {
        if (!value) return true; // empty means no change
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
      }
    ),
}) as yup.ObjectSchema<EditFormValues>;

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialUsername, setInitialUsername] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EditFormValues>({ resolver: yupResolver(schema) });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(Number(id));
        setInitialUsername(user.username);
        reset({ username: user.username, email: user.email });
      } catch {
        alert('Failed to load user data.');
        navigate(-1);
      }
    };
    fetchUser();
  }, [id, reset, navigate]);

  const onSubmit = async (data: EditFormValues) => {
    // Only send non-empty fields
    const payload: UpdateUserFormData = {};
    if (data.username) payload.username = data.username;
    if (data.email) payload.email = data.email;
    if (data.password) payload.password = data.password;

    try {
      await updateUser(Number(id), payload);
      alert('User updated successfully.');
      navigate('/users');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Update failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <main className={styles.container}>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Edit user form"
      >
        <h1>Edit User: {initialUsername}</h1>

        {errors.root && (
          <div className={styles.errorBanner} role="alert">
            {errors.root.message}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="edit-username">Username</label>
          <input
            id="edit-username"
            type="text"
            aria-describedby={errors.username ? 'edit-username-error' : undefined}
            {...register('username')}
          />
          {errors.username && (
            <span id="edit-username-error" className={styles.error} role="alert">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="edit-email">Email</label>
          <input
            id="edit-email"
            type="email"
            aria-describedby={errors.email ? 'edit-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <span id="edit-email-error" className={styles.error} role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="edit-password">New Password <span className={editStyles.optional}>(leave empty to keep current)</span></label>
          <input
            id="edit-password"
            type="password"
            autoComplete="new-password"
            aria-describedby={errors.password ? 'edit-password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <span id="edit-password-error" className={styles.error} role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className={editStyles.buttons}>
          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            className={editStyles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditUserPage;
