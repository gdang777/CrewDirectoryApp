import { ApiClient } from '@crewdirectoryapp/api-client';
import type { Playbook, City, POI, ApiResponse } from '@crewdirectoryapp/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient(API_BASE_URL);
  }

  setToken(token: string | null): void {
    this.client.setToken(token);
  }

  async getPlaybooks(cityId?: string): Promise<Playbook[]> {
    const url = cityId ? `/playbooks?cityId=${cityId}` : '/playbooks';
    const response = await this.client.get<Playbook[]>(url);
    return response.data;
  }

  async getPlaybook(id: string): Promise<Playbook> {
    const response = await this.client.get<Playbook>(`/playbooks/${id}`);
    return response.data;
  }

  async getCities(): Promise<City[]> {
    const response = await this.client.get<City[]>('/playbooks/cities');
    return response.data;
  }

  async getCityByCode(code: string): Promise<City> {
    const response = await this.client.get<City>(`/playbooks/cities/${code}`);
    return response.data;
  }

  async getPOIsNearby(lat: number, lng: number, radius?: number): Promise<POI[]> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
    });
    if (radius) {
      params.append('radius', radius.toString());
    }
    const response = await this.client.get<POI[]>(`/playbooks/pois/nearby?${params}`);
    return response.data;
  }

  // Products API
  async getProducts(category?: string): Promise<Product[]> {
    const url = category ? `/products?category=${category}` : '/products';
    const response = await this.client.get<Product[]>(url);
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.client.get<Product>(`/products/${id}`);
    return response.data;
  }

  async comparePrices(
    productId: string,
    cityCode: string,
    homeBaseCode: string,
  ): Promise<{ current: any; homeBase: any; deltaPercent: number }> {
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
  }

  async getProductsWithPriceDelta(
    cityCode: string,
    homeBaseCode: string,
    minDelta: number = 15,
  ): Promise<Product[]> {
    const params = new URLSearchParams({
      cityCode,
      homeBaseCode,
      minDelta: minDelta.toString(),
    });
    const response = await this.client.get<Product[]>(`/products/price-delta?${params}`);
    return response.data;
  }
}

export const apiService = new ApiService();
