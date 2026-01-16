import { ApiClient } from '@crewdirectoryapp/api-client';
import type { Playbook, City, POI, Product } from '@crewdirectoryapp/shared';
import { mockPlaybooks, mockCities, mockProducts } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Flag to use mock data when backend is unavailable
const USE_MOCK_ON_ERROR = true;

class ApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient(API_BASE_URL);
  }

  setToken(token: string | null): void {
    this.client.setToken(token);
  }

  async getPlaybooks(cityId?: string): Promise<Playbook[]> {
    try {
      const url = cityId ? `/playbooks?cityId=${cityId}` : '/playbooks';
      const response = await this.client.get<Playbook[]>(url);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        console.warn('Using mock playbooks data (backend offline)');
        return cityId
          ? mockPlaybooks.filter((p) => p.cityId === cityId)
          : mockPlaybooks;
      }
      throw error;
    }
  }

  async getPlaybook(id: string): Promise<Playbook> {
    try {
      const response = await this.client.get<Playbook>(`/playbooks/${id}`);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        const playbook = mockPlaybooks.find((p) => p.id === id);
        if (playbook) return playbook;
      }
      throw error;
    }
  }

  async getCities(): Promise<City[]> {
    try {
      const response = await this.client.get<City[]>('/playbooks/cities');
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        console.warn('Using mock cities data (backend offline)');
        return mockCities;
      }
      throw error;
    }
  }

  async getCityByCode(code: string): Promise<City> {
    try {
      const response = await this.client.get<City>(`/playbooks/cities/${code}`);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        const city = mockCities.find((c) => c.code === code);
        if (city) return city;
      }
      throw error;
    }
  }

  async getPOIsNearby(
    lat: number,
    lng: number,
    radius?: number
  ): Promise<POI[]> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
      });
      if (radius) {
        params.append('radius', radius.toString());
      }
      const response = await this.client.get<POI[]>(
        `/playbooks/pois/nearby?${params}`
      );
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        // Return all POIs from all playbooks as mock
        return mockPlaybooks.flatMap((p) => p.pois || []);
      }
      throw error;
    }
  }

  async createPlaybook(data: any): Promise<Playbook> {
    try {
      const response = await this.client.post<Playbook>('/playbooks', data);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        // Create a mock playbook
        const newPlaybook: Playbook = {
          id: String(Date.now()),
          ...data,
          upvotes: 0,
          downvotes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockPlaybooks.push(newPlaybook);
        console.warn('Created mock playbook (backend offline)', newPlaybook);
        return newPlaybook;
      }
      throw error;
    }
  }

  async votePlaybook(playbookId: string, value: 1 | -1): Promise<void> {
    try {
      await this.client.post('/playbooks/votes', { playbookId, value });
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        // Update mock playbook votes
        const playbook = mockPlaybooks.find((p) => p.id === playbookId);
        if (playbook) {
          if (value === 1) playbook.upvotes++;
          else playbook.downvotes++;
          console.warn('Updated mock vote (backend offline)');
        }
        return;
      }
      throw error;
    }
  }

  // Products API
  async getProducts(category?: string): Promise<Product[]> {
    try {
      const url = category ? `/products?category=${category}` : '/products';
      const response = await this.client.get<Product[]>(url);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        console.warn('Using mock products data (backend offline)');
        return category
          ? mockProducts.filter((p) => p.category === category)
          : mockProducts;
      }
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await this.client.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        const product = mockProducts.find((p) => p.id === id);
        if (product) return product;
      }
      throw error;
    }
  }

  async createProduct(data: any): Promise<Product> {
    try {
      const response = await this.client.post<Product>('/products', data);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        const newProduct: Product = {
          id: String(Date.now()),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockProducts.push(newProduct);
        console.warn('Created mock product (backend offline)', newProduct);
        return newProduct;
      }
      throw error;
    }
  }

  async comparePrices(
    productId: string,
    cityCode: string,
    homeBaseCode: string
  ): Promise<{ current: any; homeBase: any; deltaPercent: number }> {
    try {
      const params = new URLSearchParams({
        productId,
        cityCode,
        homeBaseCode,
      });
      const response = await this.client.get<{
        current: any;
        homeBase: any;
        deltaPercent: number;
      }>(`/products/compare?${params}`);
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        // Return mock price comparison
        return {
          current: { amount: 25.99, currency: 'USD', cityCode },
          homeBase: { amount: 35.99, currency: 'USD' },
          deltaPercent: -27.8,
        };
      }
      throw error;
    }
  }

  async getProductsWithPriceDelta(
    cityCode: string,
    homeBaseCode: string,
    minDelta: number = 15
  ): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        cityCode,
        homeBaseCode,
        minDelta: minDelta.toString(),
      });
      const response = await this.client.get<Product[]>(
        `/products/price-delta?${params}`
      );
      return response.data;
    } catch (error) {
      if (USE_MOCK_ON_ERROR) {
        return mockProducts;
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();
