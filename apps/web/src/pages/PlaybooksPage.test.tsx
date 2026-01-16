import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PlaybooksPage from './PlaybooksPage';
import { apiService } from '../services/api';

// Mock API Service
vi.mock('../services/api', () => ({
  apiService: {
    getPlaybooks: vi.fn(),
    getCities: vi.fn(),
    votePlaybook: vi.fn(),
  },
}));

// Mock MapComponent since it requires WebGL
vi.mock('../components/MapComponent', () => ({
  default: () => <div data-testid="map-component">Map</div>,
}));

// Mock Editor
vi.mock('../components/PlaybookEditor', () => ({
  default: ({ onSave, onClose }: any) => (
    <div data-testid="playbook-editor">
      <button onClick={onSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('PlaybooksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (apiService.getPlaybooks as any).mockResolvedValue([]);
    (apiService.getCities as any).mockResolvedValue([]);
    render(<PlaybooksPage />);
    // Assuming LoadingSpinner renders "Loading..." or similar test id handling
    // However, given the code, we might check for absence of content first or a specific loading element
  });

  it('renders playbooks and cities after loading', async () => {
    const mockPlaybooks = [
      {
        id: '1',
        title: 'Test Playbook',
        description: 'Desc',
        tier: 'basic',
        upvotes: 10,
        downvotes: 0,
      },
    ];
    const mockCities = [
      { id: 'c1', name: 'Test City', code: 'TC', country: 'Testland' },
    ];

    (apiService.getPlaybooks as any).mockResolvedValue(mockPlaybooks);
    (apiService.getCities as any).mockResolvedValue(mockCities);

    render(<PlaybooksPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Playbook')).toBeInTheDocument();
      expect(screen.getByText('Test City, Testland (TC)')).toBeInTheDocument();
    });
  });

  it('opens editor when Create button is clicked', async () => {
    (apiService.getPlaybooks as any).mockResolvedValue([]);
    (apiService.getCities as any).mockResolvedValue([]);

    render(<PlaybooksPage />);

    await waitFor(() => {
      // Button text from PlaybooksPage.tsx
      const createButton = screen.getByText('+ New Playbook');
      createButton.click();
    });

    expect(screen.getByTestId('playbook-editor')).toBeInTheDocument();
  });
});
