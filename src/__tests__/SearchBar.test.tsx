import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    onSearch: vi.fn(),
    onClear: vi.fn(),
    initialValue: '',
    loading: false,
  };

  it('renders with placeholder text', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument();
  });

  it('displays initial value', () => {
    render(<SearchBar {...defaultProps} initialValue="test query" />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', () => {
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search for movies...');
    const searchButton = screen.getByText('Search');
    fireEvent.change(input, { target: { value: 'Batman' } });
    fireEvent.click(searchButton);
    expect(onSearch).toHaveBeenCalledWith('Batman');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'Batman' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('Batman');
  });

  it('shows clear button when input has value', () => {
    render(<SearchBar {...defaultProps} initialValue="test" />);
    expect(screen.getByText('\u00D7')).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.queryByText('\u00D7')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    render(<SearchBar {...defaultProps} onClear={onClear} initialValue="test" />);
    const clearButton = screen.getByText('\u00D7');
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalled();
  });

  it('disables input and buttons when loading', () => {
    render(<SearchBar {...defaultProps} loading={true} initialValue="test" />);
    expect(screen.getByPlaceholderText('Search for movies...')).toBeDisabled();
    expect(screen.getByText('Search')).toBeDisabled();
    expect(screen.getByText('\u00D7')).toBeDisabled();
  });

  it('does not call onSearch on Enter when input is empty', () => {
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).not.toHaveBeenCalled();
  });
});
