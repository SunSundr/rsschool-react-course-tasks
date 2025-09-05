import { InputHTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  fixedHeight?: boolean;
}

export const Checkbox = ({
  label,
  error,
  disabled,
  fullWidth = true,
  fixedHeight = false,
  className = '',
  ...props
}: CheckboxProps) => {
  return (
    <div
      className={classNames(
        styles.checkboxContainer,
        {
          [styles.fullWidth]: fullWidth,
        },
        className,
      )}
    >
      <label className={classNames(styles.checkboxLabel, { [styles.disabled]: disabled })}>
        <div className={styles.checkboxWrapper}>
          <input type="checkbox" className={styles.checkboxInput} disabled={disabled} {...props} />
          <span className={styles.checkboxCustom}></span>
        </div>
        {label && <span className={styles.checkboxText}>{label}</span>}
      </label>
      {(error || fixedHeight) && <span className={styles.checkboxError}>{error}</span>}
    </div>
  );
};
