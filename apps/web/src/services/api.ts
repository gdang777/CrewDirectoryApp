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

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  airlineId?: string;
  verifiedBadge: boolean;
  karmaScore: number;
  createdAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalListings: number;
  pendingEdits: number;
  usersByRole: {
    users: number;
    admins: number;
    moderators: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SavedListing {
  id: string;
  userId: string;
  playbookId: string;
  playbook?: Playbook & { city?: City };
  createdAt: string;
}

export interface UserStats {
  listingsCount: number;
  savedCount: number;
  karmaScore: number;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  airlineId?: string;
}

// Places
export type PlaceCategory = 'eat' | 'drink' | 'shop' | 'visit';

export interface Place {
  id: string;
  name: string;
  description: string;
  tips?: string;
  category: PlaceCategory;
  cityId: string;
  city?: City;
  imageUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdById?: string;
  createdBy?: User;
  rating: number;
  ratingCount: number;
  upvotes: number;
  downvotes: number;
  comments?: PlaceComment[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaceComment {
  id: string;
  text: string;
  rating: number;
  placeId: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaceData {
  name: string;
  description: string;
  tips?: string;
  category: PlaceCategory;
  cityId: string;
  imageUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateCommentData {
  text: string;
  rating: number;
}

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: number;
}

// Products
export interface Price {
  id: string;
  amount: number;
  currency: string;
  cityCode: string;
  productId: string;
  storeName?: string;
  lastVerified?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  metadata?: {
    imageUrl?: string;
    brand?: string;
    [key: string]: any;
  };
  prices?: Price[];
}

export interface PriceComparison {
  current: Price;
  homeBase: Price;
  deltaPercent: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  airline?: string;
}

export interface LoginData {
  email: string;
  password: string;
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
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }

  logout() {
    this.clearToken();
  }

  getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
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

  // Places API
  async getPlaces(options?: {
    cityId?: string;
    cityCode?: string;
    category?: PlaceCategory;
  }): Promise<Place[]> {
    const params = new URLSearchParams();
    if (options?.cityId) params.append('cityId', options.cityId);
    if (options?.cityCode) params.append('cityCode', options.cityCode);
    if (options?.category) params.append('category', options.category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Place[]>(`/places${query}`);
  }

  async getPlace(id: string): Promise<Place> {
    return this.request<Place>(`/places/${id}`);
  }

  async createPlace(data: CreatePlaceData): Promise<Place> {
    return this.request<Place>('/places', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlace(
    id: string,
    data: Partial<CreatePlaceData>
  ): Promise<Place> {
    return this.request<Place>(`/places/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePlace(id: string): Promise<void> {
    await this.request(`/places/${id}`, { method: 'DELETE' });
  }

  // Place comments
  async getPlaceComments(placeId: string): Promise<PlaceComment[]> {
    return this.request<PlaceComment[]>(`/places/${placeId}/comments`);
  }

  async addPlaceComment(
    placeId: string,
    data: CreateCommentData
  ): Promise<PlaceComment> {
    return this.request<PlaceComment>(`/places/${placeId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deletePlaceComment(commentId: string): Promise<void> {
    await this.request(`/places/comments/${commentId}`, { method: 'DELETE' });
  }

  // Place voting
  async votePlace(placeId: string, value: 1 | -1): Promise<VoteResult> {
    return this.request<VoteResult>(`/places/${placeId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  }

  async getPlaceVote(placeId: string): Promise<{ value: number }> {
    return this.request<{ value: number }>(`/places/${placeId}/vote`);
  }

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    const query = category ? `?category=${category}` : '';
    return this.request<Product[]>(`/products${query}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(data: {
    name: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    cityCode: string;
  }): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async comparePrices(
    productId: string,
    cityCode: string,
    homeBaseCode: string
  ): Promise<PriceComparison> {
    const params = new URLSearchParams({
      productId,
      cityCode,
      homeBaseCode,
    });
    return this.request<PriceComparison>(
      `/products/compare?${params.toString()}`
    );
  }

  async getProductsWithPriceDelta(
    cityCode: string,
    homeBaseCode: string,
    minDelta: number = 15
  ): Promise<{ product: Product; comparison: PriceComparison }[]> {
    const params = new URLSearchParams({
      cityCode,
      homeBaseCode,
      minDelta: minDelta.toString(),
    });
    return this.request<{ product: Product; comparison: PriceComparison }[]>(
      `/products/price-delta?${params.toString()}`
    );
  }

  // User profile
  async getProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/users/stats');
  }

  async getUserListings(): Promise<Playbook[]> {
    return this.request<Playbook[]>('/users/listings');
  }

  // Saved listings
  async getSavedListings(): Promise<SavedListing[]> {
    return this.request<SavedListing[]>('/users/saved');
  }

  async saveListing(playbookId: string): Promise<SavedListing> {
    return this.request<SavedListing>(`/users/saved/${playbookId}`, {
      method: 'POST',
    });
  }

  async unsaveListing(playbookId: string): Promise<void> {
    await this.request(`/users/saved/${playbookId}`, {
      method: 'DELETE',
    });
  }

  async checkIfSaved(playbookId: string): Promise<boolean> {
    const result = await this.request<{ saved: boolean }>(
      `/users/saved/${playbookId}/check`
    );
    return result.saved;
  }

  // Admin endpoints
  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  async getAdminUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<User>> {
    return this.request<PaginatedResult<User>>(
      `/admin/users?page=${page}&limit=${limit}`
    );
  }

  async getRecentUsers(days: number = 7): Promise<User[]> {
    return this.request<User[]>(`/admin/users/recent?days=${days}`);
  }

  async getAdminListings(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<Playbook>> {
    return this.request<PaginatedResult<Playbook>>(
      `/admin/listings?page=${page}&limit=${limit}`
    );
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return this.request<User>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/');
  }
  // Chat Rooms
  async getCityRooms(cityCode: string): Promise<ChatRoom[]> {
    return this.request<ChatRoom[]>(`/chat/rooms/${cityCode}`);
  }

  async getRoom(roomId: string): Promise<ChatRoom> {
    return this.request<ChatRoom>(`/chat/room/${roomId}`);
  }

  async createCityRoom(cityCode: string, name: string): Promise<ChatRoom> {
    return this.request<ChatRoom>('/chat/rooms', {
      method: 'POST',
      body: JSON.stringify({ cityCode, name }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;

// Chat
export type ChatRoomType = 'CITY_GROUP' | 'DM' | 'CUSTOM_GROUP';

export interface ChatParticipant {
  id: string;
  userId: string;
  user: User;
  roomId: string;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender?: User;
  roomId: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: ChatRoomType;
  metadata?: Record<string, any>;
  participants?: ChatParticipant[];
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}
