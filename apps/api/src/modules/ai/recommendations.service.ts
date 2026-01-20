import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Place, PlaceCategory } from '../places/entities/place.entity';
import {
  UserInteraction,
  InteractionType,
} from './entities/user-interaction.entity';
import { UserPreference } from './entities/user-preference.entity';

interface RecommendationScore {
  place: Place;
  score: number;
  reason: string;
}

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(UserInteraction)
    private interactionRepository: Repository<UserInteraction>,
    @InjectRepository(UserPreference)
    private preferenceRepository: Repository<UserPreference>
  ) {}

  /**
   * Get personalized place recommendations for a user
   */
  async getPlaceRecommendations(userId: string, limit = 10): Promise<Place[]> {
    try {
      // Get user's interaction history
      const interactions = await this.interactionRepository.find({
        where: { userId },
        relations: ['place', 'place.city'],
        order: { createdAt: 'DESC' },
        take: 50, // Last 50 interactions
      });

      // Get user's preferences
      const preferences = await this.preferenceRepository.findOne({
        where: { userId },
      });

      // Get places user has already interacted with
      const viewedPlaceIds = interactions.map((i) => i.placeId);

      // Extract user's favorite categories from interactions
      const categoryCount = new Map<PlaceCategory, number>();
      interactions.forEach((i) => {
        if (i.place?.category) {
          categoryCount.set(
            i.place.category,
            (categoryCount.get(i.place.category) || 0) + 1
          );
        }
      });

      // Determine top categories
      const topCategories = Array.from(categoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry) => entry[0]);

      // Build query for candidate places
      const queryBuilder = this.placeRepository
        .createQueryBuilder('place')
        .leftJoinAndSelect('place.city', 'city')
        .where('place.rating IS NOT NULL');

      // Exclude already viewed places
      if (viewedPlaceIds.length > 0) {
        queryBuilder.andWhere('place.id NOT IN (:...viewedIds)', {
          viewedIds: viewedPlaceIds,
        });
      }

      // Prioritize categories user likes
      if (topCategories.length > 0 || preferences?.favoriteCategories) {
        const preferredCategories = [
          ...topCategories,
          ...(preferences?.favoriteCategories || []),
        ];
        if (preferredCategories.length > 0) {
          queryBuilder.andWhere('place.category IN (:...categories)', {
            categories: preferredCategories,
          });
        }
      }

      // Get candidate places
      const candidates = await queryBuilder
        .orderBy('place.rating', 'DESC')
        .limit(limit * 3) // Get more than needed for scoring
        .getMany();

      // Score and rank candidates
      const scoredPlaces = candidates.map((place) =>
        this.scorePlaceForUser(place, interactions, preferences)
      );

      // Sort by score and return top N
      scoredPlaces.sort((a, b) => b.score - a.score);

      return scoredPlaces.slice(0, limit).map((sp) => sp.place);
    } catch (error) {
      this.logger.error('Error generating recommendations:', error);
      // Fallback to popular places
      return this.getFallbackRecommendations(limit);
    }
  }

  /**
   * Score a place for a specific user
   */
  private scorePlaceForUser(
    place: Place,
    interactions: UserInteraction[],
    preferences?: UserPreference
  ): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];

    // Base score from rating (0-50 points)
    if (place.rating) {
      score += place.rating * 10;
      if (place.rating >= 4.5) {
        reasons.push('Highly rated');
      }
    }

    // Category preference match (0-30 points)
    const userCategories =
      interactions
        .map((i) => i.place?.category)
        .filter((c) => c !== undefined) || [];
    const categoryFrequency = userCategories.filter(
      (c) => c === place.category
    ).length;

    if (categoryFrequency > 0) {
      score += Math.min(30, categoryFrequency * 10);
      reasons.push(`Matches your ${place.category} preferences`);
    }

    // Explicit preference match (0-20 points)
    if (preferences?.favoriteCategories?.includes(place.category)) {
      score += 20;
    }

    // Popularity boost (0-10 points)
    const totalVotes = (place.upvotes || 0) + (place.downvotes || 0);
    if (totalVotes > 10) {
      score += Math.min(10, totalVotes / 5);
      reasons.push('Popular among crew');
    }

    // Diversity penalty - avoid recommending too similar to recent interactions
    const recentSimilar = interactions
      .slice(0, 5)
      .filter((i) => i.place?.category === place.category).length;
    if (recentSimilar > 3) {
      score -= 15; // Penalize if too similar to recent views
    }

    const reason =
      reasons.length > 0 ? reasons.join(', ') : 'Recommended for you';

    return { place, score, reason };
  }

  /**
   * Fallback recommendations (popular places)
   */
  private async getFallbackRecommendations(limit: number): Promise<Place[]> {
    return this.placeRepository.find({
      relations: ['city'],
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  /**
   * Log user interaction with a place
   */
  async logInteraction(
    userId: string,
    placeId: string,
    type: InteractionType
  ): Promise<void> {
    const interaction = this.interactionRepository.create({
      userId,
      placeId,
      type,
    });

    await this.interactionRepository.save(interaction);

    this.logger.debug(
      `Logged ${type} interaction for user ${userId} on place ${placeId}`
    );
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreference>
  ): Promise<UserPreference> {
    let userPref = await this.preferenceRepository.findOne({
      where: { userId },
    });

    if (!userPref) {
      userPref = this.preferenceRepository.create({
        userId,
        ...preferences,
      });
    } else {
      Object.assign(userPref, preferences);
    }

    return this.preferenceRepository.save(userPref);
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string): Promise<UserPreference | null> {
    return this.preferenceRepository.findOne({ where: { userId } });
  }
}
