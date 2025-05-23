'use client';

import styles from './login.module.scss';
import Logo from '../components/Logo';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { signIn } from 'next-auth/react';

type LoginFormInputs = {
  userId: string;
  password: string;
  keepLoggedIn: boolean;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Cookies.get('loggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const onSubmit = async (data: LoginFormInputs) => {
    const result = await signIn('credentials', {
      redirect: false,
      userId: data.userId,
      password: data.password,
    });


    if (result?.error) {
      setFormError('Invalid credentials');
    } else if (result?.ok) {
      setFormError('');
      router.push('/profile');
    } else {
      setFormError('Login failed. Please try again.');
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
            <input
              type="text"
              {...register('userId', { required: 'User ID is required' })}
            />
            {errors.userId && <span className={styles.errorText}>{errors.userId.message}</span>}
          </label>

          <label className={styles.passwordField}>
            Password*
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>👁️</span>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
          </label>

          <div className={styles.checkbox}>
            <input type="checkbox" id="keepLoggedIn" {...register('keepLoggedIn')} />
            <label htmlFor="keepLoggedIn">Keep me logged in</label>
          </div>

          <button className={styles.loginButton} type="submit">
            LOGIN
          </button>


          <div className={styles.register}>
            No account? <Link href="/register">Register here.</Link>
          </div>
        </form>
      </div>

      {formError && <div className={styles.error}>{formError}</div>}
    </div>
  );
}
