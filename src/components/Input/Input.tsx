import { forwardRef, InputHTMLAttributes, useState } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
  fixedHeight?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      onClear,
      showClearButton = false,
      fixedHeight = false,
      value,
      onChange,
      id,
      type = 'text',
      className = '',
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isControlled = value !== undefined;
    const displayValue = isControlled ? value : internalValue;
    const hasValue = displayValue !== '' && displayValue !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue('');
      onClear?.();
      const event = new Event('input', { bubbles: true });
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.value = '';
        ref.current.dispatchEvent(event);
      }
    };

    return (
      <div className={`${styles.inputContainer} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
        <div
          className={`${styles.inputWrapper} ${error ? styles.error : ''} ${props.disabled ? styles.disabled : ''}`}
        >
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={styles.inputField}
            placeholder=" "
            value={displayValue}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label htmlFor={inputId} className={styles.inputLabel}>
              {label}
            </label>
          )}
          {showClearButton && hasValue && !props.disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear input"
            >
              &#215;
            </button>
          )}
        </div>
        {(fixedHeight || error) && <span className={styles.inputError}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
