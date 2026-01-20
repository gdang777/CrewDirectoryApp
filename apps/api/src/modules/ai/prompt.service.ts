import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place, PlaceCategory } from '../places/entities/place.entity';
import { City } from '../playbooks/entities/city.entity';

interface ConversationContext {
  cityCode?: string;
  category?: PlaceCategory;
  userPreferences?: string[];
}

@Injectable()
export class PromptService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {}

  /**
   * Build system prompt for AI Travel Concierge
   */
  async buildConciergePrompt(
    cityCode: string,
    context?: ConversationContext
  ): Promise<string> {
    // Fetch city data
    const city = await this.cityRepository.findOne({
      where: { code: cityCode.toUpperCase() },
    });

    if (!city) {
      return this.getDefaultConciergePrompt();
    }

    // Fetch top places in the city
    const places = await this.placeRepository.find({
      where: { city: { code: cityCode.toUpperCase() } },
      take: 20,
      order: { rating: 'DESC' },
      relations: ['city'],
    });

    const placesList = places
      .map(
        (p) =>
          `- ${p.name} (${p.category}): ${p.description || 'No description'}. Rating: ${p.rating || 'N/A'}/5`
      )
      .join('\n');

    return `You are an AI Travel Concierge for airline crew members using the Crew Lounge app.

Current Context:
- City: ${city.name}, ${city.country} (${city.code})
- User is likely an airline crew member with limited time (layover)
- They want quick, actionable recommendations

Available Places in ${city.name}:
${placesList || 'No places available yet.'}

Your Role:
- Provide helpful, concise recommendations for places to visit, eat, drink, shop, or sleep
- Consider typical crew schedules (short layovers, jetlag, budget-conscious)
- Be friendly and conversational
- If asked about a specific place, provide details from the list above
- If a place isn't in the list, you can still provide general knowledge but mention it's not in our database
- Keep responses brief (2-3 paragraphs max)
- Use emojis occasionally to be friendly (🍕🌟✈️)

Remember:
- You're assisting aviation professionals, so time-efficiency matters
- Mention proximity to airports or hotels when relevant
- Consider opening hours for short layovers`;
  }

  /**
   * Build prompt for itinerary generation
   */
  async buildItineraryPrompt(
    cityCode: string,
    duration: number,
    preferences: string[],
    currentLocation?: { latitude: number; longitude: number }
  ): Promise<{ systemPrompt: string; userPrompt: string; places: Place[] }> {
    const city = await this.cityRepository.findOne({
      where: { code: cityCode.toUpperCase() },
    });

    if (!city) {
      throw new Error('City not found');
    }

    // Fetch places matching preferences
    const queryBuilder = this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.city', 'city')
      .where('city.code = :code', { code: cityCode.toUpperCase() });

    if (preferences.length > 0) {
      queryBuilder.andWhere('place.category IN (:...categories)', {
        categories: preferences as PlaceCategory[],
      });
    }

    const places = await queryBuilder
      .orderBy('place.rating', 'DESC')
      .limit(30)
      .getMany();

    const placesData = places.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      rating: p.rating,
      tips: p.tips,
      address: p.address,
    }));

    const systemPrompt = `You are an expert trip planner for airline crew members. Create optimized itineraries that maximize enjoyment within limited timeframes.

City: ${city.name}, ${city.country}
Available Duration: ${duration} hours
User Preferences: ${preferences.join(', ') || 'No specific preferences'}

Guidelines:
- Create a realistic timeline considering travel time between locations
- Assume 15-30 minutes travel time between places (unless very close)
- Consider meal times (breakfast, lunch, dinner)
- Leave buffer time for delays and rest
- Prioritize highly-rated places
- Balance different types of activities
- Account for typical opening hours

Output Format (JSON):
{
  "itinerary": {
    "duration": ${duration},
    "items": [
      {
        "placeId": "uuid",
        "placeName": "Name",
        "startTime": "09:00",
        "endTime": "10:30",
        "duration": 90,
        "reason": "Why this place at this time",
        "tips": "Pro tips for crew members"
      }
    ],
    "summary": "Brief overview of the itinerary",
    "totalPlaces": 5
  }
}`;

    const userPrompt = `Create a ${duration}-hour itinerary for ${city.name} using these places:

${JSON.stringify(placesData, null, 2)}

Generate a realistic, optimized itinerary that crew members will love!`;

    return { systemPrompt, userPrompt, places };
  }

  /**
   * Build prompt for recommendations
   */
  buildRecommendationPrompt(
    userHistory: any[],
    candidatePlaces: Place[]
  ): string {
    const historyStr = userHistory.map((h) => h.place.name).join(', ');

    return `Based on a user who has shown interest in: ${historyStr}

Rank these places by how well they match the user's preferences (1-10 score):
${candidatePlaces.map((p) => `- ${p.name} (${p.category})`).join('\n')}

Provide scores in JSON format:
{
  "recommendations": [
    { "placeId": "uuid", "score": 8, "reason": "Why recommended" }
  ]
}`;
  }

  /**
   * Default system prompt if no city context
   */
  private getDefaultConciergePrompt(): string {
    return `You are an AI Travel Concierge for airline crew members using the Crew Lounge app.

Your Role:
- Help crew members discover great places during their layovers
- Provide quick, actionable travel advice
- Be friendly and understand the unique needs of aviation professionals
- Keep responses concise and helpful

Since no specific city context is available, provide general travel advice or ask the user which city they're interested in.`;
  }
}
