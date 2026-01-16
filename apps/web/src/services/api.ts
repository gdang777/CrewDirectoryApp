// API Service for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface City {
  id: string;
  name: string;
  country: string;
  code: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

export interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number];
  };
  playbookId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  tier: 'basic' | 'pro';
  cityId: string;
  upvotes: number;
  downvotes: number;
  pois?: POI[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  airlineId?: string;
  verifiedBadge: boolean;
  karmaScore: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] =
        `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async login(email: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    this.setToken(response.access_token);
    return response;
  }

  // Cities
  async getCities(): Promise<City[]> {
    return this.request<City[]>('/playbooks/cities');
  }

  async getCityByCode(code: string): Promise<City | null> {
    const cities = await this.getCities();
    return cities.find((c) => c.code === code) || null;
  }

  async createCity(data: {
    name: string;
    country: string;
    code: string;
  }): Promise<City> {
    return this.request<City>('/playbooks/cities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Playbooks (Places)
  async getPlaybooks(cityId?: string): Promise<Playbook[]> {
    const query = cityId ? `?cityId=${cityId}` : '';
    return this.request<Playbook[]>(`/playbooks${query}`);
  }

  async getPlaybookById(id: string): Promise<Playbook> {
    return this.request<Playbook>(`/playbooks/${id}`);
  }

  async createPlaybook(data: {
    title: string;
    description: string;
    cityId: string;
    tier?: 'basic' | 'pro';
  }): Promise<Playbook> {
    return this.request<Playbook>('/playbooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async votePlaybook(id: string, value: 1 | -1): Promise<void> {
    await this.request(`/playbooks/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  }

  // POIs (Points of Interest)
  async addPOI(
    playbookId: string,
    data: {
      name: string;
      description?: string;
      category?: string;
      coordinates: { lat: number; lng: number };
    }
  ): Promise<POI> {
    return this.request<POI>(`/playbooks/${playbookId}/pois`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        coordinates: {
          type: 'Point',
          coordinates: [data.coordinates.lng, data.coordinates.lat],
        },
      }),
    });
  }

  // User profile
  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/');
  }
}

export const apiService = new ApiService();
export default apiService;
