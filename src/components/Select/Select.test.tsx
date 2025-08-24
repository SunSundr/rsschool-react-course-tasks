import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

describe('Select', () => {
  it('renders with label', () => {
    render(<Select label="Test Select" options={mockOptions} />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select error="Test error" fixedHeight options={mockOptions} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<Select options={mockOptions} />);

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('selects option when clicked', () => {
    const onChange = vi.fn();
    render(<Select options={mockOptions} onChange={onChange} />);

    fireEvent.click(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText('Option 1'));

    expect(onChange).toHaveBeenCalledWith('option1');
  });

  it('filters options when autoComplete is enabled', () => {
    render(<Select options={mockOptions} autoComplete />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(input);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('shows clear button when has value', () => {
    render(<Select options={mockOptions} value="option1" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    render(<Select options={mockOptions} value="option1" onChange={() => {}} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('closes dropdown when clicking outside', async () => {
    const { container } = render(<Select options={mockOptions} />);

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      const dropdown = container.querySelector('[class*="selectDropdown"]');
      expect(dropdown?.className).toMatch(/hidden/);
    });
  });
});
