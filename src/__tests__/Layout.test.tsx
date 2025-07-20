import { Component } from 'react';
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

describe('Layout', () => {
  it('renders header, main content, and footer', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>,
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children in main element', () => {
    render(
      <Layout>
        <div>Child 1</div>
        <div>Child 2</div>
      </Layout>,
    );
    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByText('Child 1'));
    expect(main).toContainElement(screen.getByText('Child 2'));
  });

  it('passes updateContext function to Header', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>,
    );
    const updateButton = screen.getByText('Update Search');
    expect(updateButton).toBeInTheDocument();
  });

  it('updates context when updateContext is called', () => {
    class ContextSpy extends Component {
      static contextType = RefreshContext;
      declare context: React.ContextType<typeof RefreshContext>;

      render() {
        return <div data-testid="context-value">{this.context.updateTrigger.toString()}</div>;
      }
    }
    render(
      <Layout>
        <ContextSpy />
      </Layout>,
    );
    expect(screen.getByTestId('context-value')).toHaveTextContent('false');
    fireEvent.click(screen.getByText('Update Search'));
    expect(screen.getByTestId('context-value')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('Update Search'));
    expect(screen.getByTestId('context-value')).toHaveTextContent('false');
  });

  it('handles non-element children', () => {
    render(
      <Layout>
        Just a string child
        {null}
        {false}
      </Layout>,
    );
    expect(screen.getByText('Just a string child')).toBeInTheDocument();
  });
});
