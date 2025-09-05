import { SelectHTMLAttributes } from 'react';
import { FilterChangeType } from '~/types';
import { classNames } from '~/utils/classNames';
import styles from './Filters.module.css';

interface SelectFilterGroupProps extends Omit<SelectHTMLAttributes<HTMLElement>, 'onChange'> {
  label: string;
  type: FilterChangeType;
  value: string | number;
  defaultValue?: string | number;
  options: string[] | number[];
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    type: FilterChangeType,
  ) => void;
  disabled: boolean;
  classNameWrapper?: string;
}

export const SelectFilterGroup = ({
  label,
  type,
  value,
  options,
  onChange,
  disabled,
  defaultValue,
  classNameWrapper,
  ...props
}: SelectFilterGroupProps) => {
  return (
    <div className={classNames(styles.filterGroup, classNameWrapper)}>
      <label className={styles.label}>{label}:</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e, type)}
        disabled={disabled}
        {...props}
      >
        {disabled && type === 'year' && <option value="">0000</option>}
        {defaultValue && <option value="">{defaultValue}</option>}
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
