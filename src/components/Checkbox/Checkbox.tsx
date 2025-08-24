import { forwardRef, InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, fullWidth = true, id, className = '', disabled, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div
        className={`${styles['checkbox-container']} ${fullWidth ? styles['full-width'] : ''} ${className}`}
      >
        <label
          htmlFor={checkboxId}
          className={`${styles['checkbox-label']} ${disabled ? styles.disabled : ''}`}
        >
          <div className={styles['checkbox-wrapper']}>
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={styles['checkbox-input']}
              disabled={disabled}
              {...props}
            />
            <span className={styles['checkbox-custom']}></span>
          </div>
          {label && <span className={styles['checkbox-text']}>{label}</span>}
        </label>
        {error && <span className={styles['checkbox-error']}>{error}</span>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
