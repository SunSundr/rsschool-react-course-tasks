import React, { forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'autoComplete'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  fixedHeight?: boolean;
  direction?: 'up' | 'down';
  options: SelectOption[];
  autoComplete?: boolean;
  onClear?: () => void;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      fixedHeight = false,
      options,
      autoComplete = false,
      direction = 'down',
      value,
      onClear,
      onChange,
      id,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(value || '');
    const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasValue = selectedValue !== '' || inputValue !== '';

    useEffect(() => {
      setSelectedValue(value || '');
      if (!autoComplete && value) {
        const selected = options.find((opt) => opt.value === value);
        setInputValue(selected?.label || '');
      }
    }, [value, options, autoComplete]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (newValue) {
        const filtered = options.filter((opt) =>
          opt.label.toLowerCase().includes(newValue.toLowerCase()),
        );
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions(options);
      }
      setSelectedValue('');
      onChange?.(newValue);
    };

    const handleSelectOption = (option: SelectOption) => {
      setInputValue(option.label);
      setSelectedValue(option.value);
      setIsOpen(false);
      onChange?.(option.value);
    };

    const handleClear = () => {
      setInputValue('');
      setSelectedValue('');
      setFilteredOptions(options);
      onChange?.('');
      onClear?.();
      setIsOpen(false);
    };

    const handleFocus = () => {
      setTimeout(() => {
        if (!isOpen) setIsOpen(true);
      }, 200);
    };

    const handleClick = () => {
      setIsOpen(!isOpen);
      isOpen ? inputRef.current?.blur() : inputRef.current?.focus();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div
        className={`${styles.selectContainer} ${fullWidth ? styles.fullWidth : ''} ${className}`}
        ref={wrapperRef}
      >
        <div
          className={`${styles.selectWrapper} ${error ? styles.error : ''} 
            ${disabled ? styles.disabled : ''} ${isOpen ? styles.open : ''} 
            ${isOpen ? styles[`open-${direction}`] : ''}`}
          onClick={handleClick}
        >
          <input
            ref={ref}
            type="text"
            id={selectId}
            className={styles.selectInput}
            value={inputValue}
            onChange={autoComplete ? handleInputChange : undefined}
            onFocus={handleFocus}
            placeholder=" "
            disabled={disabled}
            readOnly={!autoComplete}
            autoComplete="on"
            {...props}
          />

          {label && (
            <label
              htmlFor={selectId}
              className={`${styles.selectLabel} ${hasValue || isOpen ? styles.floating : ''}`}
            >
              {label}
            </label>
          )}

          <div className={styles.selectArrows}>
            {hasValue && !disabled && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Clear selection"
              >
                &#215;
              </button>
            )}
            <span className={styles.dropdownArrow}>▼</span>
          </div>
        </div>

        {(error || fixedHeight) && (
          <span
            className={`${isOpen && direction === 'down' ? styles.hidden : ''} ${styles.selectError}`}
          >
            {error}
          </span>
        )}

        {filteredOptions.length > 0 && (
          <div
            className={`${styles.selectDropdown} ${styles[direction]} ${isOpen ? '' : styles.hidden}`}
          >
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`${styles.selectOption} ${selectedValue === option.value ? styles.selected : ''}`}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
