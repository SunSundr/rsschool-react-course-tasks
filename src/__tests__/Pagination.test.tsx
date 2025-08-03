import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../components/Pagination/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 2,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  it('renders pagination with current page input', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByText('of 5')).toBeInTheDocument();
  });

  it('renders Previous and Next buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with next page when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should handle Next click gracefully when no pages exist', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} currentPage={5} totalPages={0} onPageChange={onPageChange} />,
    );
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('disables Previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('updates input value when currentPage prop changes', () => {
    const { rerender } = render(<Pagination {...defaultProps} />);
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    rerender(<Pagination {...defaultProps} currentPage={3} />);
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  it('calls onPageChange with valid page number on Enter', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    const input = screen.getByDisplayValue('2');
    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('ignores invalid page number on Enter', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    const input = screen.getByDisplayValue('2');
    fireEvent.change(input, { target: { value: '6' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onPageChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(2);
  });

  it('calls onPageChange after debounce timeout', async () => {
    vi.useFakeTimers();
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    const input = screen.getByDisplayValue('2');
    fireEvent.change(input, { target: { value: '3' } });
    vi.advanceTimersByTime(500);
    expect(onPageChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onPageChange).toHaveBeenCalledWith(3);

    vi.useRealTimers();
  });

  it('handles single page correctly', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });
});
