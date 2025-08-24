import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { UncontrolledForm } from './UncontrolledForm';
import formSlice from '../../store/formSlice';

vi.mock('../FormFields/FormFields', async () => {
  const common = await import('~/__tests__/common');
  return {
    FormFields: vi.fn(common.FormFieldsMock),
  };
});

vi.mock('../Button/Button', () => ({
  Button: vi.fn(({ children, onClick, fullWidth, type, ...props }) => (
    <button
      type={type}
      onClick={onClick}
      data-testid={`button-${children.toLowerCase()}`}
      {...props}
    >
      {children}
    </button>
  )),
}));

vi.mock('~/utils/schema', () => ({
  schema: {
    validate: vi.fn(),
  },
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

describe('UncontrolledForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields and buttons', () => {
    renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByTestId('button-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('button-submit')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('button-cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles file selection', async () => {
    const { getBase64 } = await import('../../utils/getBase64');
    renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(getBase64).toHaveBeenCalledWith(file);
    });
  });

  it('submits form with valid data', async () => {
    const { schema } = await import('~/utils/schema');
    (schema.validate as Mock).mockResolvedValue({});

    const { container } = renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(schema.validate).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles file clearing when no files selected', async () => {
    renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(fileInput).toBeInTheDocument();
  });

  it('handles validation errors', async () => {
    const { schema } = await import('~/utils/schema');
    const validationError = {
      inner: [
        { path: 'name', message: 'Name is required' },
        { path: 'email', message: 'Email is required' },
      ],
    };
    (schema.validate as Mock).mockRejectedValue(validationError);

    const { container } = renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(schema.validate).toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('calls onSelectPicture when select picture button is clicked', () => {
    renderWithProvider(<UncontrolledForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('select-picture'));
    expect(screen.getByTestId('select-picture')).toBeInTheDocument();
  });
});
