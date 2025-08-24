import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="Test error" fixedHeight />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows clear button when showClearButton is true and has value', () => {
    render(<Input showClearButton value="test" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    render(<Input showClearButton value="test" onChange={() => {}} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('works as uncontrolled component', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<Input fullWidth={false} className="custom" error="error" />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('custom');
    expect(wrapper).not.toHaveClass('fullWidth');
  });
});
