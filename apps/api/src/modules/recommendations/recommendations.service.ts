import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserInteraction,
  InteractionType,
} from './entities/user-interaction.entity';
import { Place } from '../places/entities/place.entity';
import { PlaceCategory } from '../places/entities/place.entity';

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    @InjectRepository(UserInteraction)
    private interactionRepository: Repository<UserInteraction>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>
  ) {}

  /**
   * Log a user interaction
   */
  async trackInteraction(
    userId: string,
    placeId: string,
    type: InteractionType
  ): Promise<void> {
    try {
      const interaction = this.interactionRepository.create({
        userId,
        placeId,
        type,
      });
      await this.interactionRepository.save(interaction);
    } catch (error) {
      // Log but don't fail the request for analytics
      this.logger.warn(`Failed to track interaction: ${error.message}`);
    }
  }

  /**
   * Get personalized recommendations using a simple collaborative filtering approach
   * 1. Analyze recent user interactions to find preferred categories
   * 2. Fetch top-rated places in those categories
   * 3. Fallback to general top-rated places in the city
   */
  async getRecommendations(
    userId: string,
    cityCode: string,
    limit: number = 10
  ): Promise<Place[]> {
    // 1. Analyze User Preferences
    const recentInteractions = await this.interactionRepository.find({
      where: { userId },
      relations: ['place', 'place.city'],
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const categoryScores: Record<string, number> = {};
    const interactedPlaceIds = new Set<string>();

    recentInteractions.forEach((interaction) => {
      interactedPlaceIds.add(interaction.placeId);

      const category = interaction.place?.category;
      if (!category) return;

      // Scoring weights
      const weight =
        {
          [InteractionType.VIEW]: 1,
          [InteractionType.CLICK]: 2,
          [InteractionType.SAVE]: 5,
          [InteractionType.SHARE]: 4,
        }[interaction.type] || 1;

      categoryScores[category] = (categoryScores[category] || 0) + weight;
    });

    // Determine top categories
    const topCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat as PlaceCategory)
      .slice(0, 3); // Top 3 categories

    this.logger.debug(
      `User ${userId} top categories: ${topCategories.join(', ')}`
    );

    // 2. Fetch Candidates
    let query = this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.city', 'city')
      .where('city.code = :cityCode', { cityCode: cityCode.toUpperCase() })
      // Exclude places user has already interacted with heavily (optional, keeping simple for now)
      // .andWhere('place.id NOT IN (:...ids)', { ids: Array.from(interactedPlaceIds) })
      .orderBy('place.rating', 'DESC')
      .addOrderBy('place.ratingCount', 'DESC');

    if (topCategories.length > 0) {
      // Boost Score Logic: We'll fetch more candidates and re-rank in memory or use complex SQL
      // For MVP: We will modify the query to prioritize these categories using SQL ordering
      // Note: TypeORM generic helper for CASE/WHEN ordering is verbose, so we'll fetch and sort in memory
      // Fetch slightly more to filter/sort
      query = query.take(limit * 3);
    } else {
      query = query.take(limit);
    }

    const candidates = await query.getMany();

    // 3. Re-rank/Personalize
    if (topCategories.length > 0) {
      return candidates
        .sort((a, b) => {
          const aScore = this.calculateScore(a, topCategories);
          const bScore = this.calculateScore(b, topCategories);
          return bScore - aScore; // Descending
        })
        .slice(0, limit);
    }

    return candidates.slice(0, limit);
  }

  private calculateScore(place: Place, topCategories: string[]): number {
    let score = (place.rating || 0) * 10; // Base score (0-50)

    // Boost if in preferred category
    const categoryIndex = topCategories.indexOf(place.category);
    if (categoryIndex !== -1) {
      // 1st place: +30, 2nd: +20, 3rd: +10
      score += (3 - categoryIndex) * 10;
    }

    return score;
  }
}
