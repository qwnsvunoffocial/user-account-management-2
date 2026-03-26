import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUsers, updateUser } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import styles from './AuthForm.module.css';
import profileStyles from './ProfilePage.module.css';

type ProfileFormValues = {
  username?: string;
  email?: string;
  password?: string;
};

const schema: yup.ObjectSchema<ProfileFormValues> = yup.object({
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
        if (!value) return true;
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
      }
    ),
}) as yup.ObjectSchema<ProfileFormValues>;

const ProfilePage: React.FC = () => {
  const { username, login, token, role } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [profileInfo, setProfileInfo] = useState<User | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProfileFormValues>({ resolver: yupResolver(schema) });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Find the current user's ID by loading all users (ADMIN) or querying the list
        const users = await getUsers().catch(() => null);
        if (users) {
          const me = users.find((u) => u.username === username);
          if (me) {
            setUserId(me.id);
            setProfileInfo(me);
            reset({ username: me.username, email: me.email });
          }
        }
      } catch {
        // If user is not ADMIN, try fetching directly – not possible without knowing ID
        // In that case the user will need to use the Edit page via navigation
      }
    };
    fetchProfile();
  }, [username, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;

    const payload: ProfileFormValues = {};
    if (data.username) payload.username = data.username;
    if (data.email) payload.email = data.email;
    if (data.password) payload.password = data.password;

    try {
      const updated = await updateUser(userId, payload);
      setProfileInfo(updated);
      setSuccessMsg('Profile updated successfully!');
      // Refresh auth context with new username if changed
      if (updated.username !== username && token && role) {
        login(token, updated.username, role);
      }
      setTimeout(() => setSuccessMsg(''), 3000);
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
        aria-label="Edit profile form"
      >
        <h1>My Profile</h1>

        {profileInfo && (
          <div className={profileStyles.info}>
            <p><strong>Role:</strong> {profileInfo.role}</p>
            <p><strong>Member since:</strong> {new Date(profileInfo.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        {successMsg && (
          <div className={profileStyles.success} role="status">
            {successMsg}
          </div>
        )}

        {errors.root && (
          <div className={styles.errorBanner} role="alert">
            {errors.root.message}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="profile-username">Username</label>
          <input
            id="profile-username"
            type="text"
            aria-describedby={errors.username ? 'profile-username-error' : undefined}
            {...register('username')}
          />
          {errors.username && (
            <span id="profile-username-error" className={styles.error} role="alert">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            aria-describedby={errors.email ? 'profile-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <span id="profile-email-error" className={styles.error} role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="profile-password">
            New Password <span className={profileStyles.optional}>(leave empty to keep current)</span>
          </label>
          <input
            id="profile-password"
            type="password"
            autoComplete="new-password"
            aria-describedby={errors.password ? 'profile-password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <span id="profile-password-error" className={styles.error} role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || !userId} className={styles.submitBtn}>
          {isSubmitting ? 'Saving…' : 'Update Profile'}
        </button>
      </form>
    </main>
  );
};

export default ProfilePage;
