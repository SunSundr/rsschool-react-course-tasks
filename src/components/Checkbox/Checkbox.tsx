import { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  fixedHeight?: boolean;
}

export const Checkbox = ({
  id,
  label,
  className = '',
  error,
  disabled,
  fixedHeight = false,
  fullWidth = true,
  ...props
}: CheckboxProps) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div
      className={`${styles.checkboxContainer} ${fullWidth ? styles.fullWidth : ''} ${className}`}
    >
      <label
        htmlFor={checkboxId}
        className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''}`}
      >
        <div className={styles.checkboxWrapper}>
          <input
            id={checkboxId}
            type="checkbox"
            className={styles.checkboxInput}
            disabled={disabled}
            {...props}
          />
          <span className={styles.checkboxCustom}></span>
        </div>
        {label && <span className={styles.checkboxText}>{label}</span>}
      </label>
      {(error || fixedHeight) && <span className={styles.checkboxError}>{error}</span>}
    </div>
  );
};
