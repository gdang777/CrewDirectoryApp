import { ApiClient } from '@crewdirectoryapp/api-client';
import type {
  Playbook,
  City,
  Product,
  Place,
  PlaceComment,
  PlaceCategory,
  VoteResult,
  CreatePlaceData,
  CreateCommentData,
  Gig,
  GigApplication,
  CreateGigData,
  ChatRoom,
  User,
  AuthResponse,
  SignupData,
  LoginData,
  PriceComparison,
  UserStats,
} from '@crewdirectoryapp/shared';
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

  // ============ Token Management ============

  setToken(token: string | null): void {
    this.client.setToken(token);
  }

  getToken(): string | null {
    return this.client.getToken();
  }

  // ============ Auth Methods ============

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      '/auth/register',
      data
    );
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/auth/profile');
    return response.data;
  }

  logout(): void {
    this.client.setToken(null);
  }

  // ============ Cities ============

  async getCities(): Promise<City[]> {
    const response = await this.client.get<City[]>('/playbooks/cities');
    return response.data;
  }

  async getCityByCode(code: string): Promise<City | null> {
    const response = await this.client.get<City>(`/playbooks/cities/${code}`);
    return response.data;
  }

  async createCity(data: {
    name: string;
    country: string;
    code: string;
    imageUrl?: string;
  }): Promise<City> {
    const response = await this.client.post<City>('/playbooks/cities', data);
    return response.data;
  }

  // ============ Playbooks (Legacy) ============

  async getPlaybooks(cityId?: string): Promise<Playbook[]> {
    const url = cityId ? `/playbooks?cityId=${cityId}` : '/playbooks';
    const response = await this.client.get<Playbook[]>(url);
    return response.data;
  }

  async getPlaybookById(id: string): Promise<Playbook> {
    const response = await this.client.get<Playbook>(`/playbooks/${id}`);
    return response.data;
  }

  // ============ Places ============

  async getPlaces(options?: {
    cityId?: string;
    cityCode?: string;
    category?: PlaceCategory;
    search?: string;
    minRating?: number;
    maxRating?: number;
    sortBy?: 'rating' | 'newest' | 'oldest' | 'popular' | 'distance';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }): Promise<Place[]> {
    const params = new URLSearchParams();
    if (options?.cityId) params.append('cityId', options.cityId);
    if (options?.cityCode) params.append('cityCode', options.cityCode);
    if (options?.category) params.append('category', options.category);
    if (options?.search) params.append('search', options.search);
    if (options?.minRating !== undefined)
      params.append('minRating', options.minRating.toString());
    if (options?.maxRating !== undefined)
      params.append('maxRating', options.maxRating.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options?.limit !== undefined)
      params.append('limit', options.limit.toString());
    if (options?.offset !== undefined)
      params.append('offset', options.offset.toString());

    const url = `/places${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.client.get<Place[]>(url);
    return response.data;
  }

  async getPlace(id: string): Promise<Place> {
    const response = await this.client.get<Place>(`/places/${id}`);
    return response.data;
  }

  async createPlace(data: CreatePlaceData): Promise<Place> {
    const response = await this.client.post<Place>('/places', data);
    return response.data;
  }

  async updatePlace(
    id: string,
    data: Partial<CreatePlaceData>
  ): Promise<Place> {
    const response = await this.client.patch<Place>(`/places/${id}`, data);
    return response.data;
  }

  async deletePlace(id: string): Promise<void> {
    await this.client.delete(`/places/${id}`);
  }

  // ============ Place Comments ============

  async getPlaceComments(placeId: string): Promise<PlaceComment[]> {
    const response = await this.client.get<PlaceComment[]>(
      `/places/${placeId}/comments`
    );
    return response.data;
  }

  async addPlaceComment(
    placeId: string,
    data: CreateCommentData
  ): Promise<PlaceComment> {
    const response = await this.client.post<PlaceComment>(
      `/places/${placeId}/comments`,
      data
    );
    return response.data;
  }

  async deletePlaceComment(commentId: string): Promise<void> {
    await this.client.delete(`/comments/${commentId}`);
  }

  // ============ Place Voting ============

  async votePlace(placeId: string, value: 1 | -1): Promise<VoteResult> {
    const response = await this.client.post<VoteResult>(
      `/places/${placeId}/vote`,
      {
        value,
      }
    );
    return response.data;
  }

  async getPlaceVote(placeId: string): Promise<{ value: number }> {
    const response = await this.client.get<{ value: number }>(
      `/places/${placeId}/vote`
    );
    return response.data;
  }

  // ============ Products ============

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
    homeBaseCode: string
  ): Promise<PriceComparison> {
    const response = await this.client.get<PriceComparison>(
      `/products/${productId}/compare?current=${cityCode}&homeBase=${homeBaseCode}`
    );
    return response.data;
  }

  // ============ Gigs ============

  async getGigs(options?: {
    cityId?: string;
    cityCode?: string;
    category?: string;
    search?: string;
    minPayRate?: number;
    maxPayRate?: number;
    payType?: string;
    status?: string;
    sortBy?: 'newest' | 'oldest' | 'pay_high' | 'pay_low' | 'popular';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }): Promise<Gig[]> {
    const params = new URLSearchParams();
    if (options?.cityId) params.append('cityId', options.cityId);
    if (options?.cityCode) params.append('cityCode', options.cityCode);
    if (options?.category) params.append('category', options.category);
    if (options?.search) params.append('search', options.search);
    if (options?.minPayRate !== undefined)
      params.append('minPayRate', options.minPayRate.toString());
    if (options?.maxPayRate !== undefined)
      params.append('maxPayRate', options.maxPayRate.toString());
    if (options?.payType) params.append('payType', options.payType);
    if (options?.status) params.append('status', options.status);
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options?.limit !== undefined)
      params.append('limit', options.limit.toString());
    if (options?.offset !== undefined)
      params.append('offset', options.offset.toString());

    const url = `/gigs${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.client.get<Gig[]>(url);
    return response.data;
  }

  async getGig(id: string): Promise<Gig> {
    const response = await this.client.get<Gig>(`/gigs/${id}`);
    return response.data;
  }

  async createGig(data: CreateGigData): Promise<Gig> {
    const response = await this.client.post<Gig>('/gigs', data);
    return response.data;
  }

  async updateGig(id: string, data: Partial<CreateGigData>): Promise<Gig> {
    const response = await this.client.patch<Gig>(`/gigs/${id}`, data);
    return response.data;
  }

  async deleteGig(id: string): Promise<void> {
    await this.client.delete(`/gigs/${id}`);
  }

  async applyToGig(gigId: string, message?: string): Promise<GigApplication> {
    const response = await this.client.post<GigApplication>(
      `/gigs/${gigId}/apply`,
      {
        message,
      }
    );
    return response.data;
  }

  async getMyGigApplications(): Promise<GigApplication[]> {
    const response = await this.client.get<GigApplication[]>(
      '/gigs/applications/me'
    );
    return response.data;
  }

  async getGigApplications(gigId: string): Promise<GigApplication[]> {
    const response = await this.client.get<GigApplication[]>(
      `/gigs/${gigId}/applications`
    );
    return response.data;
  }

  async updateApplicationStatus(
    applicationId: string,
    status: 'accepted' | 'rejected'
  ): Promise<GigApplication> {
    const response = await this.client.patch<GigApplication>(
      `/gigs/applications/${applicationId}/status`,
      { status }
    );
    return response.data;
  }

  // ============ Chat ============

  async getCityRooms(cityCode: string): Promise<ChatRoom[]> {
    const response = await this.client.get<ChatRoom[]>(
      `/chat/rooms?cityCode=${cityCode}`
    );
    return response.data;
  }

  async getRoom(roomId: string): Promise<ChatRoom> {
    const response = await this.client.get<ChatRoom>(`/chat/rooms/${roomId}`);
    return response.data;
  }

  async createCityRoom(cityCode: string, name: string): Promise<ChatRoom> {
    const response = await this.client.post<ChatRoom>('/chat/rooms', {
      cityCode,
      name,
    });
    return response.data;
  }

  // ============ User Profile ============

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    airlineId?: string;
  }): Promise<User> {
    const response = await this.client.patch<User>('/users/profile', data);
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.client.get<UserStats>('/users/stats');
    return response.data;
  }

  async getUserListings(): Promise<Playbook[]> {
    const response = await this.client.get<Playbook[]>('/users/listings');
    return response.data;
  }

  // ============ Health Check ============

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get<{ status: string }>('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
