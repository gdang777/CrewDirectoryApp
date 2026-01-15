import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
