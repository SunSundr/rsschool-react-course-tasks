import { Component } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Layout, RefreshContext } from '../components/Layout/Layout';

vi.mock('../components/Header/Header', () => ({
  Header: ({ updateContext }: { updateContext: () => void }) => (
    <header data-testid="header">
      <button onClick={updateContext}>Update Search</button>
    </header>
  ),
}));

vi.mock('../components/Footer/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

const TestComponent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

describe('Layout', () => {
  const renderWithRouter = (element: React.ReactElement) => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element,
          },
        ],
      },
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('renders header, main content, and footer', () => {
    renderWithRouter(<div>Test content</div>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders outlet content in main element', () => {
    renderWithRouter(
      <TestComponent>
        <div>Child 1</div>
        <div>Child 2</div>
      </TestComponent>,
    );
    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByText('Child 1'));
    expect(main).toContainElement(screen.getByText('Child 2'));
  });

  it('passes updateContext function to Header', () => {
    renderWithRouter(<div>Test content</div>);
    const updateButton = screen.getByText('Update Search');
    expect(updateButton).toBeInTheDocument();
  });

  it('updates context when updateContext is called', () => {
    class ContextSpy extends Component {
      static contextType = RefreshContext;
      declare context: React.ContextType<typeof RefreshContext>;

      render() {
        return (
          <div>
            <div data-testid="update-trigger">{this.context.updateTrigger.toString()}</div>
            <div data-testid="close-trigger">{this.context.closeTrigger.toString()}</div>
          </div>
        );
      }
    }
    renderWithRouter(<ContextSpy />);
    expect(screen.getByTestId('update-trigger')).toHaveTextContent('false');
    expect(screen.getByTestId('close-trigger')).toHaveTextContent('false');
    fireEvent.click(screen.getByText('Update Search'));
    expect(screen.getByTestId('update-trigger')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('Update Search'));
    expect(screen.getByTestId('update-trigger')).toHaveTextContent('false');
  });

  it('handles outlet content', () => {
    renderWithRouter(
      <TestComponent>
        Just a string child
        {null}
        {false}
      </TestComponent>,
    );
    expect(screen.getByText('Just a string child')).toBeInTheDocument();
  });

  it('updates closeTrigger when handleCloseTrigger is called', () => {
    class ContextSpy extends Component {
      static contextType = RefreshContext;
      declare context: React.ContextType<typeof RefreshContext>;

      render() {
        return (
          <div>
            <div data-testid="close-trigger">{this.context.closeTrigger.toString()}</div>
            <button onClick={this.context.handleCloseTrigger}>Close</button>
          </div>
        );
      }
    }
    renderWithRouter(<ContextSpy />);
    expect(screen.getByTestId('close-trigger')).toHaveTextContent('false');
    fireEvent.click(screen.getByText('Close'));
    expect(screen.getByTestId('close-trigger')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('Close'));
    expect(screen.getByTestId('close-trigger')).toHaveTextContent('false');
  });
});
