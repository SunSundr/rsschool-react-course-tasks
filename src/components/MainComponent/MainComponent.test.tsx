import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FormType, StateValues } from '~/types';
import { MainComponent } from './MainComponent';
import formSlice from '../../store/formSlice';

vi.mock('../Button/Button', () => ({
  Button: vi.fn(({ children, onClick, style }) => (
    <button
      onClick={onClick}
      style={style}
      data-testid={`button-${children.toLowerCase().replace(' ', '-')}`}
    >
      {children}
    </button>
  )),
}));

vi.mock('../Modal/Modal', () => ({
  Modal: vi.fn(({ isOpen, onClose, title, children }) =>
    isOpen ? (
      <div data-testid={`modal-${title.toLowerCase().replace(' ', '-')}`}>
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        {children}
      </div>
    ) : null,
  ),
}));

vi.mock('../UncontrolledForm/UncontrolledForm', () => ({
  UncontrolledForm: vi.fn(({ onClose }) => (
    <div data-testid="uncontrolled-form">
      <button onClick={onClose} data-testid="form-close">
        Close Form
      </button>
    </div>
  )),
}));

vi.mock('../HookForms/HookForm', () => ({
  HookForm: vi.fn(({ onClose }) => (
    <div data-testid="hook-form">
      <button onClick={onClose} data-testid="form-close">
        Close Form
      </button>
    </div>
  )),
}));

const createMockStore = (formHistory: StateValues[] = [], newEntryId: number | null = null) =>
  configureStore({
    reducer: { form: formSlice },
    preloadedState: {
      form: {
        formHistory,
        newEntryId,
        countries: ['USA'],
        uncontrolledFormData: null,
        hookFormData: null,
        errors: {},
      },
    },
  });

describe('Main', () => {
  const mockData = {
    name: 'Test',
    email: 'test@test.com',
    age: 25,
    type: FormType.hook,
    terms: true,
    country: 'USA',
    gender: 'male',
    password: 'test',
    confirmPassword: 'test',
    picture: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders empty state when no form history', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );
    expect(
      screen.getByText(
        'No form submissions yet. Create your first submission using the buttons above.',
      ),
    ).toBeInTheDocument();
  });

  it('renders form cards when history exists', () => {
    const mockHistory = [{ ...mockData, name: 'John', email: 'john@test.com' }];
    const store = createMockStore(mockHistory);
    render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );
    fireEvent.click(screen.getByTestId('button-uncontrolled-form'));
    expect(screen.getByTestId('modal-uncontrolled-form')).toBeInTheDocument();
  });

  it('opens hook form modal', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );
    fireEvent.click(screen.getByTestId('button-hook-form'));
    expect(screen.getByTestId('modal-hook-form')).toBeInTheDocument();
  });

  it('highlights new entry and clears after timeout', async () => {
    const store = createMockStore([mockData], 0);
    const { container } = render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );
    const card = container.querySelector('[class*="card"][class*="highlight"]');
    expect(card).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    const highlightedCard = container.querySelector('[class*="card"][class*="highlight"]');
    expect(highlightedCard).toBeNull();
  });

  it('closes uncontrolled modal when modal onClose is called', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('button-uncontrolled-form'));
    expect(screen.getByTestId('modal-uncontrolled-form')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('modal-uncontrolled-form')).not.toBeInTheDocument();
  });

  it('closes hook modal when modal onClose is called', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainComponent />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('button-hook-form'));
    expect(screen.getByTestId('modal-hook-form')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('modal-hook-form')).not.toBeInTheDocument();
  });
});
