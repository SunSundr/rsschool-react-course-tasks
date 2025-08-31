import { ChangeEvent } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HookForm } from './HookForm';
import formSlice from '../../store/formSlice';
import { getBase64 } from '../../utils/getBase64';

vi.mock('../FormFields/FormFields', async () => {
  const common = await import('~/__tests__/common');
  return {
    FormFields: vi.fn(common.FormFieldsMock),
  };
});

vi.mock('../Button/Button', () => ({
  Button: vi.fn(
    ({ children, onClick, type, disabled, fullWidth, variant, color, size, style, ...props }) => (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        data-testid={`button-${children.toLowerCase()}`}
        style={style}
        {...props}
      >
        {children}
      </button>
    ),
  ),
}));

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      fn({ name: 'test', email: 'test@test.com', age: 25, picture: null });
    }),
    formState: { errors: {}, isValid: true, isSubmitting: false },
    trigger: vi.fn(),
    setValue: vi.fn(),
  })),
}));

vi.mock('../../utils/getBase64', () => ({
  getBase64: vi.fn(() => Promise.resolve('base64-string')),
}));

const mockStore = configureStore({
  reducer: { form: formSlice },
  preloadedState: {
    form: {
      countries: ['USA', 'Canada'],
      formHistory: [],
      newEntryId: null,
      uncontrolledFormData: null,
      hookFormData: null,
      errors: {},
    },
  },
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>);
};

describe('HookForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields and buttons', () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByTestId('button-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('button-submit')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('button-cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles file selection', async () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(getBase64).toHaveBeenCalledWith(file);
    });
  });

  it('submits form successfully', () => {
    const { container } = renderWithProvider(<HookForm onClose={mockOnClose} />);
    fireEvent.submit(container.querySelector('form')!);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles onSelectPicture functionality', () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('select-picture'));
    expect(screen.getByTestId('select-picture')).toBeInTheDocument();
  });

  it('handles window focus event after onSelectPicture', () => {
    vi.useFakeTimers();
    const addEventListenerSpy = vi.spyOn(globalThis.window, 'addEventListener');
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('select-picture'));
    vi.advanceTimersByTime(10);
    expect(addEventListenerSpy).toHaveBeenCalled();
    addEventListenerSpy.mockRestore();
    vi.useRealTimers();
  });

  it('handles onFileChange when no files selected', async () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
    fireEvent.change(fileInput, { target: { files: null } });
    await waitFor(() => {
      expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    });
  });

  it('handles handleDrop functionality', async () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const dropZone = screen.getByTestId('drop-zone');
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });
    await waitFor(() => {
      expect(getBase64).toHaveBeenCalledWith(file);
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
  });

  it('handles handleDropClear functionality', async () => {
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    // 1. image-preview is missing
    expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    // 2. add file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    // 3. image-preview has appeared
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
    // 4. dragEnd
    const dropZone = screen.getByTestId('drop-zone');
    fireEvent.dragEnd(dropZone);
    // 5. image-preview is missing
    await waitFor(() => {
      expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    });
  });

  it('handles complex onSelectPicture with file dialog cancellation', () => {
    vi.useFakeTimers();
    const addEventListenerSpy = vi.spyOn(globalThis.window, 'addEventListener');
    renderWithProvider(<HookForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('select-picture'));
    vi.advanceTimersByTime(10);
    expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
    addEventListenerSpy.mockRestore();
    vi.useRealTimers();
  });
});
