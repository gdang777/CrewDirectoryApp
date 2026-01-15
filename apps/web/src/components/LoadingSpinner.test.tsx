import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should have spinner element', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });
});
