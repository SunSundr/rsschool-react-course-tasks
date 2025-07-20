import { Component } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import * as errorUtils from '../utils/error';

vi.mock('../utils/error', () => ({
  getErrorData: vi.fn().mockReturnValue({ message: 'Test error message' }),
  errorLog: vi.fn(),
}));

const ErrorComponent = ({ shouldThrow = false }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal component content</div>;
};

class ErrorButton extends Component {
  state = { error: false };
  render() {
    return (
      <>
        <ErrorComponent shouldThrow={this.state.error} />;
        <button onClick={() => this.setState({ error: !this.state.error })} type="button">
          Generate Error
        </button>
      </>
    );
  }
}

describe('ErrorBoundary', () => {
  const originalConsoleError = globalThis.console.error;
  beforeAll(() => {
    globalThis.console.error = vi.fn();
  });

  afterAll(() => {
    globalThis.console.error = originalConsoleError;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Reset Error')).toBeInTheDocument();
  });

  it('calls errorLog when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(errorUtils.errorLog).toHaveBeenCalled();
    expect(errorUtils.getErrorData).toHaveBeenCalled();
  });

  it('resets to normal state when reset button is clicked', async () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>,
    );
    await waitFor(() => {
      expect(screen.getByText('Normal component content')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Generate Error'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Reset Error'));
    await waitFor(() => {
      expect(screen.getByText('Normal component content')).toBeInTheDocument();
    });
  });
});
