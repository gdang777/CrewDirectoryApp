import type { City } from '@crewdirectoryapp/shared';

// Place categories
export type PlaceCategory = 'eat' | 'drink' | 'shop' | 'visit';

// Place interface
export interface Place {
  id: string;
  name: string;
  description: string;
  tips?: string;
  category: PlaceCategory;
  cityCode: string;
  addedBy: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

// Mock Cities with images
export const mockCities: (City & { imageUrl: string; placeCount: number })[] = [
  {
    id: '1',
    name: 'Copenhagen',
    country: 'Denmark',
    code: 'CPH',
    coordinates: { lat: 55.6761, lng: 12.5683 },
    imageUrl:
      'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=300&fit=crop',
    placeCount: 12,
  },
  {
    id: '2',
    name: 'Bangkok',
    country: 'Thailand',
    code: 'BKK',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    imageUrl:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop',
    placeCount: 18,
  },
  {
    id: '3',
    name: 'Dubai',
    country: 'UAE',
    code: 'DXB',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    imageUrl:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
    placeCount: 15,
  },
  {
    id: '4',
    name: 'New York',
    country: 'USA',
    code: 'JFK',
    coordinates: { lat: 40.7128, lng: -74.006 },
    imageUrl:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    placeCount: 24,
  },
  {
    id: '5',
    name: 'London',
    country: 'UK',
    code: 'LHR',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    imageUrl:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    placeCount: 20,
  },
  {
    id: '6',
    name: 'Tokyo',
    country: 'Japan',
    code: 'NRT',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    imageUrl:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    placeCount: 22,
  },
  {
    id: '7',
    name: 'Singapore',
    country: 'Singapore',
    code: 'SIN',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    imageUrl:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
    placeCount: 16,
  },
  {
    id: '8',
    name: 'Paris',
    country: 'France',
    code: 'CDG',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    placeCount: 19,
  },
];

// Mock Places
export const mockPlaces: Place[] = [
  // Copenhagen
  {
    id: '1',
    name: 'The Coffee Collective',
    description: 'Award-winning specialty coffee roasters. Try the flat white!',
    tips: 'Go early to avoid the lunch rush.',
    category: 'drink',
    cityCode: 'CPH',
    addedBy: 'SAS Crew',
    upvotes: 42,
    downvotes: 2,
    createdAt: new Date('2025-06-15'),
  },
  {
    id: '2',
    name: 'Torvehallerne',
    description:
      'Covered food market with amazing Danish pastries and fresh produce.',
    tips: 'The smørrebrød stand in the back is the best.',
    category: 'eat',
    cityCode: 'CPH',
    addedBy: 'United FA',
    upvotes: 38,
    downvotes: 1,
    createdAt: new Date('2025-05-20'),
  },
  {
    id: '3',
    name: 'Illum Department Store',
    description: 'High-end shopping with great Scandinavian design brands.',
    category: 'shop',
    cityCode: 'CPH',
    addedBy: 'BA Crew',
    upvotes: 25,
    downvotes: 3,
    createdAt: new Date('2025-07-10'),
  },
  {
    id: '4',
    name: 'Nyhavn',
    description:
      'Iconic colorful harbor. Perfect for photos and a canal cruise.',
    tips: 'Skip the restaurants here - overpriced. Just walk around.',
    category: 'visit',
    cityCode: 'CPH',
    addedBy: 'Lufthansa Crew',
    upvotes: 56,
    downvotes: 0,
    createdAt: new Date('2025-04-01'),
  },

  // Bangkok
  {
    id: '5',
    name: 'Thip Samai',
    description: 'Best Pad Thai in Bangkok. Worth the queue!',
    tips: 'Get the version wrapped in egg.',
    category: 'eat',
    cityCode: 'BKK',
    addedBy: 'Thai Airways FA',
    upvotes: 89,
    downvotes: 4,
    createdAt: new Date('2025-03-15'),
  },
  {
    id: '6',
    name: 'Chatuchak Weekend Market',
    description: 'Massive market with everything from clothes to antiques.',
    tips: 'Go early Saturday morning to beat the heat and crowds.',
    category: 'shop',
    cityCode: 'BKK',
    addedBy: 'Emirates Crew',
    upvotes: 67,
    downvotes: 2,
    createdAt: new Date('2025-08-22'),
  },
  {
    id: '7',
    name: 'Sky Bar',
    description: 'Rooftop bar with incredible views. Dress code enforced.',
    tips: 'Go for sunset. Drinks are expensive but the view is free.',
    category: 'drink',
    cityCode: 'BKK',
    addedBy: 'Qatar Airways FA',
    upvotes: 54,
    downvotes: 8,
    createdAt: new Date('2025-09-10'),
  },
  {
    id: '8',
    name: 'Grand Palace',
    description: 'Stunning royal complex. A must-see for first timers.',
    tips: 'Cover your shoulders and knees. They rent clothes at entrance.',
    category: 'visit',
    cityCode: 'BKK',
    addedBy: 'Delta Crew',
    upvotes: 78,
    downvotes: 1,
    createdAt: new Date('2025-02-28'),
  },

  // Dubai
  {
    id: '9',
    name: 'Al Mallah',
    description: 'Amazing shawarma and fresh juices at local prices.',
    category: 'eat',
    cityCode: 'DXB',
    addedBy: 'Emirates Crew',
    upvotes: 45,
    downvotes: 2,
    createdAt: new Date('2025-07-05'),
  },
  {
    id: '10',
    name: 'Gold Souk',
    description: 'Traditional market for gold jewelry. Bargaining expected!',
    tips: 'Check gold price online first. Negotiate hard.',
    category: 'shop',
    cityCode: 'DXB',
    addedBy: 'Etihad FA',
    upvotes: 52,
    downvotes: 5,
    createdAt: new Date('2025-06-18'),
  },
  {
    id: '11',
    name: 'Burj Khalifa',
    description: "World's tallest building. Book observation deck in advance.",
    tips: 'Sunset tickets are worth the premium.',
    category: 'visit',
    cityCode: 'DXB',
    addedBy: 'Flydubai Crew',
    upvotes: 61,
    downvotes: 0,
    createdAt: new Date('2025-05-01'),
  },

  // New York
  {
    id: '12',
    name: "Katz's Delicatessen",
    description: 'Legendary pastrami sandwiches since 1888.',
    tips: 'Cash only at the counter. Tip the cutter!',
    category: 'eat',
    cityCode: 'JFK',
    addedBy: 'JetBlue FA',
    upvotes: 73,
    downvotes: 3,
    createdAt: new Date('2025-04-12'),
  },
  {
    id: '13',
    name: 'The High Line',
    description: 'Elevated park with art installations and city views.',
    category: 'visit',
    cityCode: 'JFK',
    addedBy: 'American Airlines Crew',
    upvotes: 88,
    downvotes: 1,
    createdAt: new Date('2025-03-20'),
  },
  {
    id: '14',
    name: "Please Don't Tell",
    description: 'Hidden speakeasy behind a phone booth. Make reservations!',
    tips: 'Call exactly at 3pm for same-day reservations.',
    category: 'drink',
    cityCode: 'JFK',
    addedBy: 'Delta FA',
    upvotes: 39,
    downvotes: 6,
    createdAt: new Date('2025-08-05'),
  },
];

// Helper to get places by city
export const getPlacesByCity = (cityCode: string): Place[] => {
  return mockPlaces.filter((p) => p.cityCode === cityCode);
};

// Helper to get places by city and category
export const getPlacesByCityAndCategory = (
  cityCode: string,
  category: PlaceCategory
): Place[] => {
  return mockPlaces.filter(
    (p) => p.cityCode === cityCode && p.category === category
  );
};

// Get city by code
export const getCityByCode = (code: string) => {
  return mockCities.find((c) => c.code === code);
};

// Property types
export type PropertyType = 'crashpad' | 'vacation';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  propertyType: string; // 'Private Room', 'Entire Apartment', 'Shared Room', 'Studio', 'Cabin', 'Condo', 'Loft'
  location: string;
  airportCode: string;
  distanceToAirport: string;
  beds: number;
  baths: number;
  hasWifi: boolean;
  price: number;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerAirline: string;
  imageUrl: string;
  isFavorite?: boolean;
}

// Mock Properties - Crashpads
export const mockProperties: Property[] = [
  // Crashpads
  {
    id: '1',
    title: 'Cozy Crashpad Near YYZ Airport',
    type: 'crashpad',
    propertyType: 'Private Room',
    location: 'Toronto, ON',
    airportCode: 'YYZ',
    distanceToAirport: '3.2 km',
    beds: 1,
    baths: 1,
    hasWifi: true,
    price: 65,
    rating: 4.9,
    reviewCount: 28,
    ownerName: 'Maria S.',
    ownerAirline: 'Air Canada',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Modern Crashpad with Dedicated Workspace',
    type: 'crashpad',
    propertyType: 'Private Room',
    location: 'Vancouver, BC',
    airportCode: 'YVR',
    distanceToAirport: '5.1 km',
    beds: 1,
    baths: 1,
    hasWifi: true,
    price: 75,
    rating: 4.7,
    reviewCount: 42,
    ownerName: 'John M.',
    ownerAirline: 'WestJet',
    imageUrl:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Entire Apartment for Flight Crew',
    type: 'crashpad',
    propertyType: 'Entire Apartment',
    location: 'Calgary, AB',
    airportCode: 'YYC',
    distanceToAirport: '2.8 km',
    beds: 2,
    baths: 1,
    hasWifi: true,
    price: 120,
    rating: 4.8,
    reviewCount: 15,
    ownerName: 'Sarah K.',
    ownerAirline: 'Swoop',
    imageUrl:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Shared Crashpad with Airport Shuttle',
    type: 'crashpad',
    propertyType: 'Shared Room',
    location: 'Montreal, QC',
    airportCode: 'YUL',
    distanceToAirport: '4.5 km',
    beds: 1,
    baths: 1.5,
    hasWifi: true,
    price: 55,
    rating: 4.6,
    reviewCount: 37,
    ownerName: 'Alex T.',
    ownerAirline: 'Air Transat',
    imageUrl:
      'https://images.unsplash.com/photo-1598928506311-c55ez2634c09?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    title: 'Quiet and Spacious Crew Stay',
    type: 'crashpad',
    propertyType: 'Private Room',
    location: 'Ottawa, ON',
    airportCode: 'YOW',
    distanceToAirport: '3.7 km',
    beds: 1,
    baths: 1,
    hasWifi: true,
    price: 85,
    rating: 4.9,
    reviewCount: 19,
    ownerName: 'James R.',
    ownerAirline: 'Porter',
    imageUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    title: 'Cozy Studio near Airport',
    type: 'crashpad',
    propertyType: 'Studio',
    location: 'Halifax, NS',
    airportCode: 'YHZ',
    distanceToAirport: '6.2 km',
    beds: 1,
    baths: 1,
    hasWifi: true,
    price: 70,
    rating: 4.7,
    reviewCount: 24,
    ownerName: 'Emma L.',
    ownerAirline: 'Air Canada',
    imageUrl:
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop',
  },

  // Vacation Rentals
  {
    id: '7',
    title: 'Lakeside Cottage with Mountain Views',
    type: 'vacation',
    propertyType: 'Entire Cottage',
    location: 'Whistler, BC',
    airportCode: 'YVR',
    distanceToAirport: '120 km',
    beds: 3,
    baths: 2,
    hasWifi: true,
    price: 250,
    rating: 4.9,
    reviewCount: 45,
    ownerName: 'Michael S.',
    ownerAirline: 'Air Canada Pilot',
    imageUrl:
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop',
  },
  {
    id: '8',
    title: 'Beachfront Condo in Downtown',
    type: 'vacation',
    propertyType: 'Condo',
    location: 'Vancouver, BC',
    airportCode: 'YVR',
    distanceToAirport: '12 km',
    beds: 2,
    baths: 2,
    hasWifi: true,
    price: 195,
    rating: 4.8,
    reviewCount: 32,
    ownerName: 'Lisa W.',
    ownerAirline: 'WestJet FA',
    imageUrl:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop',
  },
  {
    id: '9',
    title: 'Mountain Cabin with Hot Tub',
    type: 'vacation',
    propertyType: 'Cabin',
    location: 'Banff, AB',
    airportCode: 'YYC',
    distanceToAirport: '145 km',
    beds: 4,
    baths: 2,
    hasWifi: true,
    price: 220,
    rating: 4.9,
    reviewCount: 28,
    ownerName: 'James K.',
    ownerAirline: 'Porter Pilot',
    imageUrl:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop',
  },
  {
    id: '10',
    title: 'Urban Loft in Historic District',
    type: 'vacation',
    propertyType: 'Loft',
    location: 'Quebec City, QC',
    airportCode: 'YQB',
    distanceToAirport: '18 km',
    beds: 1,
    baths: 1,
    hasWifi: true,
    price: 175,
    rating: 4.7,
    reviewCount: 19,
    ownerName: 'Nicole R.',
    ownerAirline: 'Air Transat FA',
    imageUrl:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
  },
];

// Get properties by type
export const getPropertiesByType = (type: PropertyType): Property[] => {
  return mockProperties.filter((p) => p.type === type);
};
