import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gig, GigCategory } from './entities/gig.entity';
import { GigApplication } from './entities/gig-application.entity';
import { City } from '../playbooks/entities/city.entity';
import { User, UserRole } from '../playbooks/entities/user.entity';
import {
  CreateGigDto,
  UpdateGigDto,
  FindAllGigsDto,
  ApplyToGigDto,
} from './dto';

@Injectable()
export class GigsService {
  constructor(
    @InjectRepository(Gig)
    private gigRepository: Repository<Gig>,
    @InjectRepository(GigApplication)
    private applicationRepository: Repository<GigApplication>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(options?: FindAllGigsDto): Promise<Gig[]> {
    const query = this.gigRepository
      .createQueryBuilder('gig')
      .leftJoinAndSelect('gig.city', 'city')
      .leftJoinAndSelect('gig.postedBy', 'postedBy');

    // City filtering
    if (options?.cityId) {
      query.andWhere('gig.cityId = :cityId', { cityId: options.cityId });
    }

    if (options?.cityCode) {
      query.andWhere('city.code = :code', {
        code: options.cityCode.toUpperCase(),
      });
    }

    // Category filtering
    if (options?.category) {
      query.andWhere('gig.category = :category', {
        category: options.category,
      });
    }

    // Status filtering (default to active only)
    const status = options?.status || 'active';
    query.andWhere('gig.status = :status', { status });

    // Pay rate filtering
    if (options?.minPayRate !== undefined) {
      query.andWhere('gig.payRate >= :minPayRate', {
        minPayRate: options.minPayRate,
      });
    }

    if (options?.maxPayRate !== undefined) {
      query.andWhere('gig.payRate <= :maxPayRate', {
        maxPayRate: options.maxPayRate,
      });
    }

    // Pay type filtering
    if (options?.payType) {
      query.andWhere('gig.payType = :payType', { payType: options.payType });
    }

    // Full-text search (if implemented)
    if (options?.search) {
      query.andWhere(
        '(gig.title ILIKE :search OR gig.description ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    // Sorting
    const sortOrder = options?.sortOrder || 'DESC';
    switch (options?.sortBy) {
      case 'newest':
        query.orderBy('gig.postedAt', 'DESC');
        break;
      case 'oldest':
        query.orderBy('gig.postedAt', 'ASC');
        break;
      case 'pay_high':
        query.orderBy('gig.payRate', 'DESC');
        break;
      case 'pay_low':
        query.orderBy('gig.payRate', 'ASC');
        break;
      case 'popular':
        query.orderBy('gig.applicationCount', 'DESC');
        break;
      default:
        query.orderBy('gig.postedAt', 'DESC');
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

  async findOne(id: string): Promise<Gig> {
    const gig = await this.gigRepository.findOne({
      where: { id },
      relations: ['city', 'postedBy', 'applications', 'applications.applicant'],
    });

    if (!gig) {
      throw new NotFoundException(`Gig with ID ${id} not found`);
    }

    return gig;
  }

  async create(createDto: CreateGigDto, userId: string): Promise<Gig> {
    const city = await this.cityRepository.findOne({
      where: { id: createDto.cityId },
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${createDto.cityId} not found`);
    }

    const gig = this.gigRepository.create({
      ...createDto,
      postedById: userId,
    });

    return this.gigRepository.save(gig);
  }

  async update(
    id: string,
    updateDto: UpdateGigDto,
    userId: string,
    userRole: UserRole
  ): Promise<Gig> {
    const gig = await this.findOne(id);

    // Only poster or admin can update
    if (gig.postedById !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own gigs');
    }

    Object.assign(gig, updateDto);
    return this.gigRepository.save(gig);
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const gig = await this.findOne(id);

    if (gig.postedById !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own gigs');
    }

    await this.gigRepository.remove(gig);
  }

  // Applications
  async apply(
    gigId: string,
    userId: string,
    dto: ApplyToGigDto
  ): Promise<GigApplication> {
    const gig = await this.findOne(gigId);

    // Check if gig is active
    if (gig.status !== 'active') {
      throw new BadRequestException('This gig is no longer active');
    }

    // Check if user already applied
    const existing = await this.applicationRepository.findOne({
      where: { gigId, applicantId: userId },
    });

    if (existing) {
      throw new BadRequestException('You have already applied to this gig');
    }

    // Check if user is not the poster
    if (gig.postedById === userId) {
      throw new BadRequestException('You cannot apply to your own gig');
    }

    const application = this.applicationRepository.create({
      gigId,
      applicantId: userId,
      message: dto.message,
    });

    await this.applicationRepository.save(application);

    // Update application count
    await this.updateApplicationCount(gigId);

    return this.applicationRepository.findOne({
      where: { id: application.id },
      relations: ['applicant', 'gig'],
    }) as Promise<GigApplication>;
  }

  async getMyApplications(userId: string): Promise<GigApplication[]> {
    return this.applicationRepository.find({
      where: { applicantId: userId },
      relations: ['gig', 'gig.city', 'gig.postedBy'],
      order: { appliedAt: 'DESC' },
    });
  }

  async getGigApplications(
    gigId: string,
    userId: string
  ): Promise<GigApplication[]> {
    const gig = await this.findOne(gigId);

    // Only poster or admin can see applications
    if (gig.postedById !== userId) {
      throw new ForbiddenException(
        'You can only view applications for your own gigs'
      );
    }

    return this.applicationRepository.find({
      where: { gigId },
      relations: ['applicant'],
      order: { appliedAt: 'DESC' },
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    status: 'accepted' | 'rejected',
    userId: string
  ): Promise<GigApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['gig'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Only gig poster can update application status
    if (application.gig.postedById !== userId) {
      throw new ForbiddenException(
        'You can only update applications for your own gigs'
      );
    }

    application.status = status;
    return this.applicationRepository.save(application);
  }

  private async updateApplicationCount(gigId: string): Promise<void> {
    const count = await this.applicationRepository.count({
      where: { gigId },
    });

    await this.gigRepository.update(gigId, { applicationCount: count });
  }
}
