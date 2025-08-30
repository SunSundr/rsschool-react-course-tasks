import {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
  ref?: React.Ref<HTMLInputElement | null>;
}

export const Select = ({
  ref,
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
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => {
    return inputRef.current as HTMLInputElement;
  });
  const hasValue = selectedValue !== '' || inputValue !== '';

  const [scroll, setScroll] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout>(undefined);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setScroll(false), 100);
  }, []);

  const handleScroll = useCallback(() => {
    setScroll(true);
    if (inputRef.current && document.activeElement !== inputRef.current) inputRef.current.focus();
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setScroll(false), 350);
  }, []);

  const closeOptions = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
    inputRef.current?.blur();
  };

  const handleSelectOption = (option: SelectOption) => {
    setInputValue(option.label);
    closeOptions(option.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue) {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(newValue.toLowerCase()),
      );
      if (filtered.length === 0) {
        setFilteredOptions(options);
        return;
      }
      setFilteredOptions(filtered);
      if (filtered.length === 1 && filtered[0].label === newValue) {
        setIsOpen(false);
        setSelectedValue(newValue);
        onChange?.(newValue);
      }
    } else {
      setFilteredOptions(options);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedValue('');
    setFilteredOptions(options);
    onClear?.();
    closeOptions('');
  };

  const handleFocus = () => {
    setTimeout(() => {
      selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    setFilteredOptions(options);
    isOpen ? closeOptions(inputValue) : inputRef.current?.focus();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      closeOptions(inputValue);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, inputValue]);

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
          ref={inputRef}
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
          className={`${styles.selectDropdown} ${styles[direction]}
            ${isOpen ? '' : styles.hidden} ${scroll ? styles.disableScrollSnap : ''}`}
          onScroll={handleScroll}
          onTouchEnd={handleTouchEnd}
        >
          {isOpen &&
            filteredOptions.map((option) => (
              <div
                key={option.value}
                ref={option.value === selectedValue ? selectedRef : null}
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
};
