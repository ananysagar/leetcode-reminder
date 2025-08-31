'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, register, clearError } from '../store/slices/authSlice';
import styles from './AuthForm.module.css';

interface AuthFormData {
  email: string;
  password: string;
  username?: string;
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    dispatch(clearError());
    
    if (isLogin) {
      await dispatch(login({ email: data.email, password: data.password }));
    } else {
      await dispatch(register({ 
        email: data.email, 
        password: data.password, 
        username: data.username || '' 
      }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
    reset();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Sign in to continue your LeetCode journey' 
              : 'Start tracking your LeetCode progress'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                {...registerField('username', {
                  required: !isLogin && 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
                className={styles.input}
                placeholder="Enter your username"
              />
              {errors.username && (
                <span className={styles.error}>{errors.username.message}</span>
              )}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              {...registerField('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={styles.input}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              {...registerField('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={styles.input}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={toggleMode}
              className={styles.toggleButton}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 