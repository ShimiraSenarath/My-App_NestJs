'use client';

import styles from './register.module.scss';
import Logo from '../components/Logo';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type RegisterFormInputs = {
  userId: string;
  password: string;
  confirmPassword: string;
  keepLoggedIn: boolean;
  email: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const router = useRouter();
  const [formError, setFormError] = useState('');


const onSubmit = async (data: RegisterFormInputs) => {
    const { userId, password, confirmPassword, keepLoggedIn } = data;
  
    if (password !== confirmPassword) {
        setFormError('Your passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setFormError(result.error || 'Registration failed. Please try again.');
      } else {
        alert('Registration successful!');
        router.push('/login');
      }
    } catch (err) {
        console.log(err);
        
        setFormError('Registration failed. Please try again.');
    }
    if (keepLoggedIn) {
              Cookies.set('loggedIn', 'true', { expires: 365 });
            } else {
              Cookies.set('loggedIn', 'true');
            }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.card}>
        <h1>
          Welcome to <strong>myApp</strong>
        </h1>
        <hr />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label>
            User ID*
            <input type="text" {...register('userId', { required: 'User ID is required' })} />
            {errors.userId && <span className={styles.errorText}>{errors.userId.message}</span>}
          </label>

          <label>
            Password*
            <input type="password" {...register('password', { required: 'Password is required' })} />
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
          </label>

          <label>
            Confirm Password*
            <input type="password" {...register('confirmPassword', { required: 'Please confirm your password' })} />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword.message}</span>}
          </label>

          <div className={styles.checkbox}>
            <input type="checkbox" id="keepLoggedIn" {...register('keepLoggedIn')} />
            <label htmlFor="keepLoggedIn">Keep me logged in</label>
          </div>

          <button className={styles.registerButton} type="submit">
            REGISTER
          </button>

          <div className={styles.loginLink}>
            Already have an account? <a href="/login">Login here.</a>
          </div>
        </form>
      </div>

      {formError && <div className={styles.error}>{formError}</div>}
    </div>
  );
}
