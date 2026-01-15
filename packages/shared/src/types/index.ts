// Common types shared across web and mobile apps

export interface User {
  id: string;
  email: string;
  name: string;
  airlineId?: string;
  verifiedBadge: boolean;
  karmaScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface City {
  id: string;
  name: string;
  country: string;
  code: string; // IATA code
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  tier: 'basic' | 'pro';
  cityId: string;
  city?: City;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface POI {
  id: string;
  name: string;
  description?: string;
  category?: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  playbookId: string;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
