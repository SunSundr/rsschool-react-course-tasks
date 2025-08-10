import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchBar } from '../components/SearchBar/SearchBar';

const mockClearVideos = vi.fn();
const mockResetMoviesQueries = vi.fn();

vi.mock('~/store/store', () => ({
  useStore: () => ({
    clearVideos: mockClearVideos,
  }),
}));

vi.mock('~/hooks/useRefreshData', () => ({
  useResetQueries: () => ({
    resetMoviesQueries: mockResetMoviesQueries,
  }),
}));

describe('SearchBar', () => {
  const defaultProps = {
    onSearch: vi.fn(),
    onClear: vi.fn(),
    initialValue: '',
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('renders refresh button', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByText('↻')).toBeInTheDocument();
  });

  it('calls resetMoviesQueries when refresh button is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    const refreshButton = screen.getByText('↻');
    fireEvent.click(refreshButton);
    expect(mockResetMoviesQueries).toHaveBeenCalled();
  });

  it('disables refresh button when loading', () => {
    render(<SearchBar {...defaultProps} loading={true} />);
    expect(screen.getByText('↻')).toBeDisabled();
  });

  it('calls clearVideos when search is performed', () => {
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search for movies...');
    const searchButton = screen.getByText('Search');
    fireEvent.change(input, { target: { value: 'Batman' } });
    fireEvent.click(searchButton);
    expect(mockClearVideos).toHaveBeenCalled();
  });

  it('calls clearVideos when clear button is clicked', () => {
    render(<SearchBar {...defaultProps} initialValue="test" />);
    const clearButton = screen.getByText('×');
    fireEvent.click(clearButton);
    expect(mockClearVideos).toHaveBeenCalled();
  });
});
