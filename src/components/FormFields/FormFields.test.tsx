import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormValues } from '~/types';
import { FormFields } from './FormFields';

vi.mock('../Input/Input', () => ({
  Input: vi.fn(
    ({ label, showClearButton, fixedHeight, onClear, fullWidth, autoComplete, ...props }) => (
      <div>
        <input data-testid={`input-${props.id}`} placeholder={label} {...props} />
        {onClear && (
          <button data-testid={`clear-${props.id}`} onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    ),
  ),
}));

vi.mock('../Select/Select', () => ({
  Select: vi.fn(
    ({ label, fixedHeight, onClear, options, fullWidth, autoComplete, onChange, ...props }) => (
      <div>
        <select
          data-testid={`select-${props.id}`}
          aria-label={label}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        >
          {options.map((opt: { value: string; label: string }) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {onClear && (
          <button data-testid={`clear-select-${props.id}`} onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    ),
  ),
}));

vi.mock('../Button/Button', () => ({
  Button: vi.fn(({ children, fullWidth, onClear, ...props }) => (
    <button data-testid="upload-button" {...props}>
      {children}
    </button>
  )),
}));

vi.mock('../Checkbox/Checkbox', () => ({
  Checkbox: vi.fn(({ label, onClear, fullWidth, fixedHeight, ...props }) => (
    <input type="checkbox" data-testid="checkbox-terms" aria-label={label} {...props} />
  )),
}));

const mockProps = {
  imageSrc: null,
  countries: ['USA', 'Canada'],
  onFileChange: vi.fn(),
  onSelectPicture: vi.fn(),
  uploadInputRef: { current: null },
};

describe('FormFields', () => {
  it('renders all form fields', () => {
    render(<FormFields {...mockProps} />);
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-age')).toBeInTheDocument();
    expect(screen.getByTestId('select-gender')).toBeInTheDocument();
    expect(screen.getByTestId('select-country')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-terms')).toBeInTheDocument();
  });

  it('renders upload button', () => {
    render(<FormFields {...mockProps} />);
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
  });

  it('displays image preview when imageSrc is provided', () => {
    render(<FormFields {...mockProps} imageSrc="test-image.jpg" />);
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });

  it('displays error message when picture error exists', () => {
    const errors = { picture: { message: 'Picture is required' } };
    render(<FormFields {...mockProps} errors={errors} />);
    expect(screen.getByText('Picture is required')).toBeInTheDocument();
  });

  it('calls onClear when clear buttons are clicked', () => {
    const log = globalThis.console.log;
    globalThis.console.log = vi.fn();
    const mockSetValue = vi.fn();
    const mockTrigger = vi.fn();
    render(<FormFields {...mockProps} setValue={mockSetValue} trigger={mockTrigger} />);
    fireEvent.click(screen.getByTestId('clear-name'));
    expect(mockSetValue).toHaveBeenCalledWith('name', '');
    expect(mockTrigger).toHaveBeenCalledWith('name');
    globalThis.console.log = log;
  });

  it('handles Select onChange for gender', () => {
    const mockRegister = vi.fn(() => ({
      onChange: vi.fn(),
      name: 'gender',
    })) as unknown as UseFormRegister<FormValues>;
    const mockTrigger = vi.fn();
    render(<FormFields {...mockProps} register={mockRegister} trigger={mockTrigger} />);
    fireEvent.change(screen.getByTestId('select-gender'), { target: { value: 'male' } });
    expect(mockRegister).toHaveBeenCalledWith('gender');
  });

  it('handles Select onChange for country', () => {
    const mockRegister = vi.fn(() => ({
      onChange: vi.fn(),
      name: 'country',
    })) as unknown as UseFormRegister<FormValues>;
    const mockTrigger = vi.fn();
    render(<FormFields {...mockProps} register={mockRegister} trigger={mockTrigger} />);
    fireEvent.change(screen.getByTestId('select-country'), { target: { value: 'USA' } });
    expect(mockRegister).toHaveBeenCalledWith('country');
  });

  it('renders with register props', () => {
    const mockRegister = vi.fn(() => ({
      name: 'test',
      onChange: vi.fn(),
    })) as unknown as UseFormRegister<FormValues>;
    render(<FormFields {...mockProps} register={mockRegister} />);
    expect(mockRegister).toHaveBeenCalledWith('name');
    expect(mockRegister).toHaveBeenCalledWith('email');
    expect(mockRegister).toHaveBeenCalledWith('age');
  });

  it('handles drag and drop events', () => {
    const mockHandleDrop = vi.fn();
    const mockHandleDropClear = vi.fn();
    const { container } = render(
      <FormFields
        {...mockProps}
        handleDrop={mockHandleDrop}
        handleDropClear={mockHandleDropClear}
      />,
    );
    const dropZone = container.querySelector('[class*="imagePreview"]');
    expect(dropZone).toBeInTheDocument();
    fireEvent.drop(dropZone!, { dataTransfer: { files: [] } });
    expect(mockHandleDrop).toHaveBeenCalled();
  });

  it('shows drag hover state', () => {
    const { container } = render(<FormFields {...mockProps} />);
    const dropZone = container.querySelector('[class*="imagePreview"]');
    fireEvent.dragEnter(dropZone!);
    fireEvent.dragLeave(dropZone!);
    expect(dropZone).toBeInTheDocument();
  });

  it('renders password strength indicator when watch is provided', () => {
    const mockWatch = vi.fn((field) =>
      field === 'password' ? 'TestPass123!' : '',
    ) as unknown as UseFormWatch<FormValues>;
    const { container } = render(<FormFields {...mockProps} watch={mockWatch} />);
    const strengthIndicator = container.querySelector('[class*="strengthIndicator"]');
    expect(strengthIndicator).toBeInTheDocument();
  });
});
