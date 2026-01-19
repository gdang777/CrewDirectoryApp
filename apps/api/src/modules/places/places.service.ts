import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place, PlaceCategory } from './entities/place.entity';
import { Comment } from './entities/comment.entity';
import { PlaceVote } from './entities/place-vote.entity';
import { City } from '../playbooks/entities/city.entity';
import { User, UserRole } from '../playbooks/entities/user.entity';
import {
  CreatePlaceDto,
  UpdatePlaceDto,
  CreateCommentDto,
  VotePlaceDto,
} from './dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(PlaceVote)
    private voteRepository: Repository<PlaceVote>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(options?: {
    cityId?: string;
    cityCode?: string;
    category?: PlaceCategory;
    search?: string;
    minRating?: number;
    maxRating?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    latitude?: number;
    longitude?: number;
    radius?: number;
    limit?: number;
    offset?: number;
  }): Promise<Place[]> {
    const query = this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.city', 'city')
      .leftJoinAndSelect('place.createdBy', 'createdBy');

    // City filtering
    if (options?.cityId) {
      query.andWhere('place.cityId = :cityId', { cityId: options.cityId });
    }

    if (options?.cityCode) {
      query.andWhere('city.code = :code', {
        code: options.cityCode.toUpperCase(),
      });
    }

    // Category filtering
    if (options?.category) {
      query.andWhere('place.category = :category', {
        category: options.category,
      });
    }

    // Full-text search
    if (options?.search) {
      query.andWhere(
        `place.search_vector @@ plainto_tsquery('english', :search)`,
        { search: options.search }
      );
    }

    // Rating filtering
    if (options?.minRating !== undefined) {
      query.andWhere('place.rating >= :minRating', {
        minRating: options.minRating,
      });
    }

    if (options?.maxRating !== undefined) {
      query.andWhere('place.rating <= :maxRating', {
        maxRating: options.maxRating,
      });
    }

    // Distance filtering (PostGIS)
    if (
      options?.latitude !== undefined &&
      options?.longitude !== undefined &&
      options?.radius
    ) {
      query.andWhere(
        `ST_DWithin(
          ST_SetSRID(ST_MakePoint(place.longitude, place.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius * 1000
        )`,
        {
          lat: options.latitude,
          lng: options.longitude,
          radius: options.radius,
        }
      );

      // Add distance calculation for sorting
      query.addSelect(
        `ST_Distance(
          ST_SetSRID(ST_MakePoint(place.longitude, place.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        ) / 1000`,
        'distance'
      );
    }

    // Sorting
    const sortOrder = options?.sortOrder || 'DESC';
    switch (options?.sortBy) {
      case 'rating':
        query.orderBy('place.rating', sortOrder);
        break;
      case 'newest':
        query.orderBy('place.createdAt', 'DESC');
        break;
      case 'oldest':
        query.orderBy('place.createdAt', 'ASC');
        break;
      case 'popular':
        query.orderBy('(place.upvotes - place.downvotes)', 'DESC');
        break;
      case 'distance':
        if (options?.latitude && options?.longitude) {
          query.orderBy('distance', 'ASC');
        } else {
          // Fallback to rating if no location provided
          query.orderBy('place.rating', 'DESC');
        }
        break;
      default:
        // Default: sort by rating
        query.orderBy('place.rating', 'DESC');
    }

    // Pagination
    if (options?.limit) {
      query.take(options.limit);
    }

    if (options?.offset) {
      query.skip(options.offset);
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['city', 'createdBy', 'comments', 'comments.user'],
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }

    return place;
  }

  async create(createDto: CreatePlaceDto, userId: string): Promise<Place> {
    const city = await this.cityRepository.findOne({
      where: { id: createDto.cityId },
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${createDto.cityId} not found`);
    }

    const place = this.placeRepository.create({
      ...createDto,
      createdById: userId,
    });

    return this.placeRepository.save(place);
  }

  async update(
    id: string,
    updateDto: UpdatePlaceDto,
    userId: string,
    userRole: UserRole
  ): Promise<Place> {
    const place = await this.findOne(id);

    // Only creator or admin can update
    if (place.createdById !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own places');
    }

    Object.assign(place, updateDto);
    return this.placeRepository.save(place);
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const place = await this.findOne(id);

    if (place.createdById !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own places');
    }

    await this.placeRepository.remove(place);
  }

  // Comments
  async getComments(placeId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { placeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async addComment(
    placeId: string,
    userId: string,
    dto: CreateCommentDto
  ): Promise<Comment> {
    const place = await this.findOne(placeId);

    const comment = this.commentRepository.create({
      ...dto,
      placeId,
      userId,
    });

    await this.commentRepository.save(comment);

    // Update place rating
    await this.updatePlaceRating(placeId);

    return this.commentRepository.findOne({
      where: { id: comment.id },
      relations: ['user'],
    }) as Promise<Comment>;
  }

  async deleteComment(
    commentId: string,
    userId: string,
    userRole: UserRole
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (
      comment.userId !== userId &&
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.MODERATOR
    ) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const placeId = comment.placeId;
    await this.commentRepository.remove(comment);
    await this.updatePlaceRating(placeId);
  }

  private async updatePlaceRating(placeId: string): Promise<void> {
    const result = await this.commentRepository
      .createQueryBuilder('comment')
      .select('AVG(comment.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('comment.placeId = :placeId', { placeId })
      .getRawOne();

    await this.placeRepository.update(placeId, {
      rating: parseFloat(result.avg) || 0,
      ratingCount: parseInt(result.count) || 0,
    });
  }

  // Voting
  async vote(
    placeId: string,
    userId: string,
    dto: VotePlaceDto
  ): Promise<{ upvotes: number; downvotes: number; userVote: number }> {
    await this.findOne(placeId); // Validate place exists

    let vote = await this.voteRepository.findOne({
      where: { placeId, userId },
    });

    if (vote) {
      if (vote.value === dto.value) {
        // Same vote - remove it (toggle off)
        await this.voteRepository.remove(vote);
      } else {
        // Different vote - update
        vote.value = dto.value;
        await this.voteRepository.save(vote);
      }
    } else {
      // New vote
      vote = this.voteRepository.create({
        placeId,
        userId,
        value: dto.value,
      });
      await this.voteRepository.save(vote);
    }

    await this.updatePlaceVotes(placeId);

    const place = await this.placeRepository.findOne({
      where: { id: placeId },
    });
    const currentVote = await this.voteRepository.findOne({
      where: { placeId, userId },
    });

    return {
      upvotes: place?.upvotes || 0,
      downvotes: place?.downvotes || 0,
      userVote: currentVote?.value || 0,
    };
  }

  async getUserVote(placeId: string, userId: string): Promise<number> {
    const vote = await this.voteRepository.findOne({
      where: { placeId, userId },
    });
    return vote?.value || 0;
  }

  private async updatePlaceVotes(placeId: string): Promise<void> {
    const upvotes = await this.voteRepository.count({
      where: { placeId, value: 1 },
    });
    const downvotes = await this.voteRepository.count({
      where: { placeId, value: -1 },
    });

    await this.placeRepository.update(placeId, { upvotes, downvotes });
  }

  // For seeding
  async createWithoutAuth(data: Partial<Place>): Promise<Place> {
    const place = this.placeRepository.create(data);
    return this.placeRepository.save(place);
  }
}
