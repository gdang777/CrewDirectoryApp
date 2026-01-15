import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from './api';

// Create a mock client
const mockClient = {
  get: vi.fn(),
  post: vi.fn(),
  setToken: vi.fn(),
};

// Mock the ApiClient class
vi.mock('@crewdirectoryapp/api-client', () => {
  return {
    ApiClient: class {
      constructor() {
        return mockClient;
      }
    },
  };
});

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set token on client', () => {
    apiService.setToken('test-token');
    expect(mockClient.setToken).toHaveBeenCalledWith('test-token');
  });

  it('should get playbooks', async () => {
    const mockPlaybooks = [{ id: '1', title: 'Test Playbook' }];
    mockClient.get.mockResolvedValue({ data: mockPlaybooks });

    const result = await apiService.getPlaybooks();

    expect(result).toEqual(mockPlaybooks);
    expect(mockClient.get).toHaveBeenCalledWith('/playbooks');
  });

  it('should get playbooks with city filter', async () => {
    const mockPlaybooks = [{ id: '1', title: 'Test Playbook' }];
    mockClient.get.mockResolvedValue({ data: mockPlaybooks });

    const result = await apiService.getPlaybooks('city-1');

    expect(result).toEqual(mockPlaybooks);
    expect(mockClient.get).toHaveBeenCalledWith('/playbooks?cityId=city-1');
  });

  it('should get products', async () => {
    const mockProducts = [{ id: '1', name: 'Test Product' }];
    mockClient.get.mockResolvedValue({ data: mockProducts });

    const result = await apiService.getProducts();

    expect(result).toEqual(mockProducts);
    expect(mockClient.get).toHaveBeenCalledWith('/products');
  });

  it('should compare prices', async () => {
    const mockComparison = {
      current: { amount: 100, currency: 'USD' },
      homeBase: { amount: 80, currency: 'USD' },
      deltaPercent: 25,
    };
    mockClient.get.mockResolvedValue({ data: mockComparison });

    const result = await apiService.comparePrices('product-1', 'CPH', 'JFK');

    expect(result).toEqual(mockComparison);
    expect(mockClient.get).toHaveBeenCalled();
  });
});
