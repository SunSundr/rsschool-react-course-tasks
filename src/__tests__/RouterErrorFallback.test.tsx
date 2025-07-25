import { createMemoryRouter, RouterProvider, useNavigate, useRouteError } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterErrorFallback } from '~/components/ErrorBoundary/RouterErrorFallback';
import { getErrorData } from '../utils/error';

vi.mock('../utils/error', () => ({
  getErrorData: vi.fn().mockImplementation((error: unknown) => ({
    message: error instanceof Error ? error.message : 'Unknown error',
  })),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...mod,
    useRouteError: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe('RouterErrorFallback', () => {
  const mockNavigate = vi.fn();
  const originalConsoleError = globalThis.console.error;
  beforeAll(() => {
    globalThis.console.error = vi.fn();
  });

  afterAll(() => {
    globalThis.console.error = originalConsoleError;
  });

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(getErrorData).mockImplementation((error: unknown) => ({
      message: error instanceof Error ? error.message : 'Unknown error',
    }));
    vi.clearAllMocks();
  });

  it('should display error message for Error object', () => {
    const testError = new Error('Test error message');
    vi.mocked(useRouteError).mockReturnValue(testError);
    render(<RouterErrorFallback />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset error/i })).toBeInTheDocument();
    expect(vi.mocked(getErrorData)).toHaveBeenCalledWith(testError);
  });

  it('should handle Response error with status code', () => {
    const testError = {
      statusCode: 404,
      message: 'Not Found',
    };
    vi.mocked(useRouteError).mockReturnValue(testError);
    vi.mocked(getErrorData).mockReturnValueOnce({
      message: 'Not Found',
      statusCode: 404,
    });
    render(<RouterErrorFallback />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(vi.mocked(getErrorData)).toHaveBeenCalledWith(testError);
  });

  it('should navigate to home when reset button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useRouteError).mockReturnValue(new Error('Test error'));
    render(<RouterErrorFallback />);
    await user.click(screen.getByRole('button', { name: /reset error/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should work with router provider', async () => {
    const user = userEvent.setup();
    const testError = new Error('Test router error');
    const FailingComponent = () => {
      throw testError;
    };

    const originalUseRouteError = await vi
      .importActual<typeof import('react-router-dom')>('react-router-dom')
      .then((mod) => mod.useRouteError);
    const originalGetErrorData = await vi
      .importActual<typeof import('../utils/error')>('../utils/error')
      .then((mod) => mod.getErrorData);

    vi.mocked(useRouteError).mockImplementation(originalUseRouteError);
    vi.mocked(getErrorData).mockImplementation(originalGetErrorData);

    const testRouter = createMemoryRouter(
      [
        {
          path: '/',
          element: <FailingComponent />,
          errorElement: <RouterErrorFallback />,
        },
      ],
      {
        initialEntries: ['/'],
        initialIndex: 0,
      },
    );

    render(<RouterProvider router={testRouter} />);
    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(await screen.findByText(/Test.*error/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /reset error/i }));
    expect(testRouter.state.location.pathname).toBe('/');
  });

  it('should handle unknown error type', () => {
    vi.mocked(useRouteError).mockReturnValue('string error');
    vi.mocked(getErrorData).mockReturnValueOnce({
      message: 'Unknown error occurred',
    });
    render(<RouterErrorFallback />);
    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
  });
});
