import { ApiClient } from '@crewdirectoryapp/api-client';
import type { Playbook, City, Product } from '@crewdirectoryapp/shared';
import { Platform } from 'react-native';

// Use special IP for Android emulator, localhost for iOS simulator
const DEV_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_API_URL;

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

  async getProducts(category?: string): Promise<Product[]> {
    const url = category ? `/products?category=${category}` : '/products';
    const response = await this.client.get<Product[]>(url);
    return response.data;
  }
}

export const apiService = new ApiService();
