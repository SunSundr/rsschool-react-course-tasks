import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '../components/Footer/Footer';

describe('Footer', () => {
  it('renders footer with links and images', () => {
    render(<Footer />);
    expect(screen.getByText('SunSundr/rsschool-react-course-tasks')).toBeInTheDocument();
    expect(screen.getByText('Rolling Scopes School')).toBeInTheDocument();
  });

  it('renders GitHub link with correct href', () => {
    render(<Footer />);
    const githubLink = screen.getByText('SunSundr/rsschool-react-course-tasks');
    expect(githubLink).toHaveAttribute('href');
  });

  it('renders RS School link with correct href', () => {
    render(<Footer />);
    const rsLink = screen.getByText('Rolling Scopes School');
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
  });

  it('renders GitHub logo image', () => {
    render(<Footer />);
    const images = screen.getAllByRole('img');
    const githubImage = images.find((img) => img.getAttribute('src')?.includes('github-mark'));
    expect(githubImage).toHaveAttribute('src', 'github-mark.svg');
  });

  it('renders RS School logo image', () => {
    render(<Footer />);
    const images = screen.getAllByRole('img');
    const rsImage = images.find((img) => img.getAttribute('src')?.includes('rss-logo'));
    expect(rsImage).toBeInTheDocument();
  });

  it('renders ErrorButton component', () => {
    render(<Footer />);
    expect(screen.getByText('Error Button')).toBeInTheDocument();
  });
});
