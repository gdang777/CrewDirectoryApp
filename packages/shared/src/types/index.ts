// Common types shared across web and mobile apps

// ============ Core Entities ============

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
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface City {
  id: string;
  name: string;
  country: string;
  code: string; // IATA code
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// ============ Places ============

export enum PlaceCategory {
  EAT = 'eat',
  DRINK = 'drink',
  SHOP = 'shop',
  VISIT = 'visit',
}

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
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceComment {
  id: string;
  text: string;
  rating: number;
  placeId: string;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: number;
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

// ============ Playbooks (Legacy) ============

export interface Playbook {
  id: string;
  title: string;
  description: string;
  tier: 'basic' | 'pro';
  cityId: string;
  city?: City;
  upvotes: number;
  downvotes: number;
  pois?: POI[];
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

// ============ Products ============

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  metadata?: Record<string, unknown>;
  prices?: Price[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Price {
  id: string;
  amount: number;
  currency: string;
  cityCode: string;
  productId: string;
  storeName?: string;
  lastVerified?: Date;
}

export interface PriceComparison {
  current: Price;
  homeBase: Price;
  deltaPercent: number;
}

// ============ Gigs ============

export enum GigCategory {
  FLIGHT_ATTENDANT = 'flight_attendant',
  PILOT = 'pilot',
  GROUND_CREW = 'ground_crew',
  HOSPITALITY = 'hospitality',
  DRIVING = 'driving',
  OTHER = 'other',
}

export enum GigStatus {
  OPEN = 'open',
  FILLED = 'filled',
  CLOSED = 'closed',
}

export enum PayType {
  HOURLY = 'hourly',
  DAILY = 'daily',
  FIXED = 'fixed',
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: GigCategory;
  cityId: string;
  city?: City;
  payRate: number;
  payType: PayType;
  duration?: string;
  requirements?: string;
  status: GigStatus;
  imageUrl?: string;
  posterId: string;
  poster?: User;
  applications?: GigApplication[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface GigApplication {
  id: string;
  gigId: string;
  gig?: Gig;
  applicantId: string;
  applicant?: User;
  message?: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGigData {
  title: string;
  description: string;
  category: GigCategory;
  cityId: string;
  payRate: number;
  payType: PayType;
  duration?: string;
  requirements?: string;
  imageUrl?: string;
}

// ============ Chat ============

export enum ChatRoomType {
  CITY = 'city',
  PROPERTY = 'property',
  GIG = 'gig',
  DIRECT = 'direct',
}

export interface ChatRoom {
  id: string;
  name: string;
  type: ChatRoomType;
  cityCode?: string;
  participants?: ChatParticipant[];
  messages?: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatParticipant {
  id: string;
  userId: string;
  user?: User;
  roomId: string;
  joinedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender?: User;
  roomId: string;
  createdAt: Date;
}

// ============ Properties ============

export enum PropertyType {
  CRASHPAD = 'crashpad',
  VACATION_RENTAL = 'vacation_rental',
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  cityId: string;
  city?: City;
  address?: string;
  price: number;
  priceUnit: string; // 'night', 'month', etc.
  bedrooms?: number;
  bathrooms?: number;
  maxOccupancy?: number;
  amenities?: string[];
  houseRules?: string[];
  imageUrl?: string;
  images?: string[];
  hostId: string;
  host?: User;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  type: PropertyType;
  cityId: string;
  address?: string;
  price: number;
  priceUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupancy?: number;
  amenities?: string[];
  houseRules?: string[];
  imageUrl?: string;
}

// ============ API Responses ============

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

// ============ User Stats ============

export interface UserStats {
  listingsCount: number;
  savedCount: number;
  karmaScore: number;
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

export interface SavedListing {
  id: string;
  userId: string;
  playbookId: string;
  playbook?: Playbook & { city?: City };
  createdAt: Date;
}
