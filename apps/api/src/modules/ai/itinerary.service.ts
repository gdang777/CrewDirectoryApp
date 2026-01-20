import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from './ai.service';
import { PromptService } from './prompt.service';
import { Itinerary, ItineraryItem } from './entities/itinerary.entity';
import { City } from '../playbooks/entities/city.entity';

interface GenerateItineraryDto {
  cityCode: string;
  duration: number; // in hours
  preferences?: string[];
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface ItineraryResponse {
  duration: number;
  items: ItineraryItem[];
  summary: string;
  totalPlaces: number;
}

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(
    private aiService: AiService,
    private promptService: PromptService,
    @InjectRepository(Itinerary)
    private itineraryRepository: Repository<Itinerary>,
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {}

  /**
   * Generate an AI-powered itinerary
   */
  async generateItinerary(
    userId: string,
    dto: GenerateItineraryDto
  ): Promise<Itinerary> {
    // Check if AI service is available, if not, prepare to fallback (but we need city first)
    if (!this.aiService.isAvailable()) {
      this.logger.warn(
        'AI service is not available, falling back to mock itinerary'
      );
      // We need to fetch the city first to generate a mock
    }

    let city: City | null = null;

    try {
      // Get city
      city = await this.cityRepository.findOne({
        where: { code: dto.cityCode.toUpperCase() },
      });

      if (!city) {
        throw new NotFoundException('City not found');
      }

      // Build prompts with context
      const { systemPrompt, userPrompt, places } =
        await this.promptService.buildItineraryPrompt(
          dto.cityCode,
          dto.duration,
          dto.preferences || [],
          dto.currentLocation
        );

      // Generate itinerary using AI
      const aiResponse = await this.aiService.generateStructuredOutput<{
        itinerary: ItineraryResponse;
      }>(`${systemPrompt}\n\n${userPrompt}`, {});

      // Create and save itinerary
      const itinerary = this.itineraryRepository.create({
        userId,
        cityId: city.id,
        duration: dto.duration,
        items: aiResponse.itinerary.items,
        preferences: dto.preferences,
        summary: aiResponse.itinerary.summary,
      });

      await this.itineraryRepository.save(itinerary);

      this.logger.log(`Generated itinerary for user ${userId} in ${city.name}`);

      return itinerary;
    } catch (error) {
      this.logger.error(
        `Error generating itinerary for city ${dto.cityCode}:`,
        error
      );

      // Always fallback to mock if city exists, regardless of the specific error
      if (city) {
        this.logger.warn(
          `⚠️ Falling back to mock itinerary generation for ${city.name} due to AI error`
        );
        return this.generateMockItinerary(userId, dto, city);
      }

      throw error;
    }
  }

  private async generateMockItinerary(
    userId: string,
    dto: GenerateItineraryDto,
    city: City
  ): Promise<Itinerary> {
    this.logger.log('Started mock itinerary generation');

    try {
      // Generate start time based on current time or default to 9 AM
      let currentHour = new Date().getHours();
      if (currentHour < 8 || currentHour > 18) currentHour = 9;

      const mockItems: ItineraryItem[] = [
        {
          placeId: 'mock-1',
          placeName: `Top Rated Café in ${city.name}`,
          startTime: `${currentHour}:00`,
          endTime: `${currentHour + 1}:30`,
          duration: 90,
          reason:
            'A favorite among local crew members for its relaxing atmosphere.',
          tips: 'Show your airline ID for a potential discount.',
        },
        {
          placeId: 'mock-2',
          placeName: 'City Center Walk',
          startTime: `${currentHour + 2}:00`,
          endTime: `${currentHour + 3}:30`,
          duration: 90,
          reason: 'Stretch your legs and see the main sights efficiently.',
          tips: 'Comfortable walking shoes are a must.',
        },
        {
          placeId: 'mock-3',
          placeName: 'Crew-Friendly Lounge/Restaurant',
          startTime: `${currentHour + 4}:00`,
          endTime: `${currentHour + 5}:30`,
          duration: 90,
          reason: 'Perfect spot for a meal before heading back.',
          tips: 'Great variety of food options.',
        },
      ];

      // Create the object but DO NOT save it to DB to avoid persistence errors
      const itinerary = this.itineraryRepository.create({
        userId,
        cityId: city.id,
        duration: dto.duration,
        items: mockItems,
        preferences: dto.preferences,
        summary: `(Offline Mode) Since the AI service is currently unavailable, here is a recommended template itinerary for ${city.name}.`,
        createdAt: new Date(),
      });

      // Assign a temp ID manually since we aren't saving to DB
      itinerary.id = 'mock-' + Date.now().toString();

      this.logger.log('Returning generated mock itinerary request');
      return itinerary;
    } catch (error) {
      this.logger.error(
        'CRITICAL: Failed to generate standard mock itinerary. Returning emergency fallback.',
        error
      );

      // EMERGENCY FALLBACK: Return a plain object cast as Itinerary to avoid any entity/DB issues
      return {
        id: 'emergency-mock-' + Date.now(),
        userId,
        cityId: city.id,
        duration: dto.duration,
        items: [],
        preferences: dto.preferences,
        summary:
          '(Recovery Mode) We are experiencing technical difficulties but here is a simple plan: Explore the city center and enjoy local cuisine!',
        createdAt: new Date(),
        city: city,
      } as any as Itinerary;
    }
  }

  /**
   * Get user's itineraries
   */
  async getUserItineraries(userId: string): Promise<Itinerary[]> {
    return this.itineraryRepository.find({
      where: { userId },
      relations: ['city'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get specific itinerary
   */
  async getItinerary(id: string, userId: string): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.findOne({
      where: { id, userId },
      relations: ['city'],
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return itinerary;
  }

  /**
   * Delete itinerary
   */
  async deleteItinerary(id: string, userId: string): Promise<void> {
    const result = await this.itineraryRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Itinerary not found');
    }
  }
}
