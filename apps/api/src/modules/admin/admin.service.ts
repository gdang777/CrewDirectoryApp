import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User, UserRole } from '../playbooks/entities/user.entity';
import { Playbook } from '../playbooks/entities/playbook.entity';
import { PlaybookEdit } from '../playbooks/entities/playbook-edit.entity';

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

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Playbook)
    private playbookRepository: Repository<Playbook>,
    @InjectRepository(PlaybookEdit)
    private playbookEditRepository: Repository<PlaybookEdit>
  ) {}

  async getStats(): Promise<AdminStats> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [totalUsers, newUsersThisWeek, totalListings, pendingEdits] =
      await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({
          where: { createdAt: MoreThan(oneWeekAgo) },
        }),
        this.playbookRepository.count(),
        this.playbookEditRepository.count({
          where: { approved: false },
        }),
      ]);

    const [usersCount, adminsCount, moderatorsCount] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.USER } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.userRepository.count({ where: { role: UserRole.MODERATOR } }),
    ]);

    return {
      totalUsers,
      newUsersThisWeek,
      totalListings,
      pendingEdits,
      usersByRole: {
        users: usersCount,
        admins: adminsCount,
        moderators: moderatorsCount,
      },
    };
  }

  async getUsers(
    options: PaginationOptions
  ): Promise<PaginatedResult<Partial<User>>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: [
        'id',
        'email',
        'name',
        'firstName',
        'lastName',
        'role',
        'verifiedBadge',
        'karmaScore',
        'createdAt',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRecentUsers(days: number = 7): Promise<Partial<User>[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    return this.userRepository.find({
      select: [
        'id',
        'email',
        'name',
        'firstName',
        'lastName',
        'role',
        'verifiedBadge',
        'createdAt',
      ],
      where: { createdAt: MoreThan(sinceDate) },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getListings(
    options: PaginationOptions
  ): Promise<PaginatedResult<Playbook>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [listings, total] = await this.playbookRepository.findAndCount({
      relations: ['city'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    await this.userRepository.update(userId, { role });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getPendingEdits(): Promise<PlaybookEdit[]> {
    return this.playbookEditRepository.find({
      where: { approved: false },
      relations: ['user', 'playbook'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveEdit(editId: string, approvedBy: string): Promise<PlaybookEdit> {
    await this.playbookEditRepository.update(editId, {
      approved: true,
      approvedBy,
    });
    const edit = await this.playbookEditRepository.findOne({
      where: { id: editId },
      relations: ['user', 'playbook'],
    });
    if (!edit) {
      throw new Error('Edit not found');
    }
    return edit;
  }

  async rejectEdit(editId: string): Promise<void> {
    await this.playbookEditRepository.delete(editId);
  }
}
