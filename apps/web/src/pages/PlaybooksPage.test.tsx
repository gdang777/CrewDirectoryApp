import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PlaybooksPage from './PlaybooksPage';
import { apiService } from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getPlaybooks: vi.fn(),
    getCities: vi.fn(),
  },
}));

describe('PlaybooksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(apiService.getPlaybooks).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );
    vi.mocked(apiService.getCities).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<PlaybooksPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render playbooks after loading', async () => {
    const mockPlaybooks = [
      {
        id: '1',
        title: 'Test Playbook',
        description: 'Test Description',
        tier: 'basic' as const,
        upvotes: 5,
        downvotes: 1,
      },
    ];
    const mockCities = [
      { id: '1', name: 'Copenhagen', country: 'Denmark', code: 'CPH' },
    ];

    vi.mocked(apiService.getPlaybooks).mockResolvedValue(mockPlaybooks);
    vi.mocked(apiService.getCities).mockResolvedValue(mockCities);

    render(<PlaybooksPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Playbook')).toBeInTheDocument();
    });
  });

  it('should render error message on failure', async () => {
    vi.mocked(apiService.getPlaybooks).mockRejectedValue(
      new Error('API Error'),
    );
    vi.mocked(apiService.getCities).mockRejectedValue(new Error('API Error'));

    render(<PlaybooksPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
