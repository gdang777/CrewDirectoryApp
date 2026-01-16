import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../playbooks/entities/user.entity';
import { Playbook } from '../playbooks/entities/playbook.entity';
import { SavedListing } from '../playbooks/entities/saved-listing.entity';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  airlineId?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Playbook)
    private playbookRepository: Repository<Playbook>,
    @InjectRepository(SavedListing)
    private savedListingRepository: Repository<SavedListing>
  ) {}

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'name',
        'firstName',
        'lastName',
        'airlineId',
        'role',
        'verifiedBadge',
        'karmaScore',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update fields
    if (updateDto.firstName !== undefined) {
      user.firstName = updateDto.firstName;
    }
    if (updateDto.lastName !== undefined) {
      user.lastName = updateDto.lastName;
    }
    if (updateDto.airlineId !== undefined) {
      user.airlineId = updateDto.airlineId;
    }

    // Update full name
    if (updateDto.firstName || updateDto.lastName) {
      user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }

    await this.userRepository.save(user);

    return this.getProfile(userId);
  }

  async getUserListings(userId: string): Promise<Playbook[]> {
    // Get playbooks where user has made edits
    const edits = await this.playbookRepository
      .createQueryBuilder('playbook')
      .leftJoinAndSelect('playbook.city', 'city')
      .leftJoin('playbook.edits', 'edit')
      .where('edit.userId = :userId', { userId })
      .groupBy('playbook.id')
      .addGroupBy('city.id')
      .orderBy('playbook.createdAt', 'DESC')
      .getMany();

    return edits;
  }

  async getSavedListings(userId: string): Promise<SavedListing[]> {
    return this.savedListingRepository.find({
      where: { userId },
      relations: ['playbook', 'playbook.city'],
      order: { createdAt: 'DESC' },
    });
  }

  async saveListing(userId: string, playbookId: string): Promise<SavedListing> {
    // Check if playbook exists
    const playbook = await this.playbookRepository.findOne({
      where: { id: playbookId },
    });

    if (!playbook) {
      throw new NotFoundException('Listing not found');
    }

    // Check if already saved
    const existing = await this.savedListingRepository.findOne({
      where: { userId, playbookId },
    });

    if (existing) {
      throw new ConflictException('Listing already saved');
    }

    const savedListing = this.savedListingRepository.create({
      userId,
      playbookId,
    });

    return this.savedListingRepository.save(savedListing);
  }

  async unsaveListing(userId: string, playbookId: string): Promise<void> {
    const result = await this.savedListingRepository.delete({
      userId,
      playbookId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Saved listing not found');
    }
  }

  async isListingSaved(userId: string, playbookId: string): Promise<boolean> {
    const count = await this.savedListingRepository.count({
      where: { userId, playbookId },
    });
    return count > 0;
  }

  async getUserStats(userId: string): Promise<{
    listingsCount: number;
    savedCount: number;
    karmaScore: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['karmaScore'],
    });

    const [listingsCount, savedCount] = await Promise.all([
      this.playbookRepository
        .createQueryBuilder('playbook')
        .leftJoin('playbook.edits', 'edit')
        .where('edit.userId = :userId', { userId })
        .getCount(),
      this.savedListingRepository.count({ where: { userId } }),
    ]);

    return {
      listingsCount,
      savedCount,
      karmaScore: user?.karmaScore || 0,
    };
  }
}
