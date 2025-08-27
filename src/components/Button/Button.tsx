import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'error' | 'warn' | 'default';
  variant?: 'outlined' | 'contained';
  fullWidth?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  ref?: React.Ref<HTMLButtonElement | null>;
}

export const Button = ({
  ref,
  color = 'default',
  variant = 'contained',
  fullWidth = false,
  loading = false,
  size = 'medium',
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    `${styles[`button--${variant}`]}`,
    `${styles[`button--${color}`]}`,
    `${styles[`button--${size}`]}`,
    fullWidth && styles['button--full-width'],
    loading && styles['button--loading'],
    disabled && styles['button--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && <span className={styles.button__spinner}></span>}
      <span className={styles.button__content}>{children}</span>
    </button>
  );
};

Button.displayName = 'Button';
