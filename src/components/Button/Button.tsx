import { ButtonHTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'error' | 'warn' | 'default';
  variant?: 'outlined' | 'contained';
  fullWidth?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({
  disabled,
  children,
  color = 'default',
  variant = 'contained',
  fullWidth = false,
  loading = false,
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={classNames(
        styles.button,
        styles[variant],
        styles[color],
        styles[size],
        {
          [styles.fullWidth]: fullWidth,
          [styles.loading]: loading,
          [styles.disabled]: disabled,
        },
        className,
      )}
      disabled={disabled || loading}
    >
      {loading && <span className={styles.spinner}></span>}
      <span className={styles.content}>{children}</span>
    </button>
  );
};
