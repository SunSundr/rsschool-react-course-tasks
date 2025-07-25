import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../components/Pagination/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 2,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  it('renders pagination with current page info', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
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
    screen.getByText('Next').removeAttribute('disabled');
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should prevent page change when currentPage is zero', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} currentPage={0} totalPages={1} onPageChange={onPageChange} />,
    );
    screen.getByText('Previous').removeAttribute('disabled');
    fireEvent.click(screen.getByText('Previous'));
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

  it('does not call onPageChange when Previous is clicked on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when Next is clicked on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('handles single page correctly', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });
});
