import { ApiClient } from '@crewdirectoryapp/api-client';
import type { Playbook, City, POI } from '@crewdirectoryapp/shared';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

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

  async getCities(): Promise<City[]> {
    const response = await this.client.get<City[]>('/playbooks/cities');
    return response.data;
  }
}

export const apiService = new ApiService();
