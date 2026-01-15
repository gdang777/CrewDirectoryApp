import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pairing, CrewMember, AvailabilityWindow, Group, Activity } from './entities';

@Injectable()
export class CrewMatchService {
  constructor(
    @InjectRepository(Pairing)
    private pairingRepository: Repository<Pairing>,
    @InjectRepository(CrewMember)
    private crewMemberRepository: Repository<CrewMember>,
    @InjectRepository(AvailabilityWindow)
    private availabilityRepository: Repository<AvailabilityWindow>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async createPairing(pairingData: Partial<Pairing>): Promise<Pairing> {
    const pairing = this.pairingRepository.create(pairingData);
    return this.pairingRepository.save(pairing);
  }

  async setAvailability(
    crewMemberId: string,
    startTime: Date,
    endTime: Date,
    cityCode: string,
  ): Promise<AvailabilityWindow> {
    const window = this.availabilityRepository.create({
      crewMemberId,
      startTime,
      endTime,
      cityCode,
    });
    return this.availabilityRepository.save(window);
  }

  async findAvailableCrew(
    cityCode: string,
    startTime: Date,
    endTime: Date,
  ): Promise<CrewMember[]> {
    return this.crewMemberRepository
      .createQueryBuilder('member')
      .innerJoin('member.availabilityWindows', 'window')
      .where('window.cityCode = :cityCode', { cityCode })
      .andWhere('window.startTime <= :startTime', { startTime })
      .andWhere('window.endTime >= :endTime', { endTime })
      .getMany();
  }

  async createGroup(
    name: string,
    cityCode: string,
    activityTime: Date,
    memberIds: string[],
  ): Promise<Group> {
    const members = await this.crewMemberRepository.findByIds(memberIds);
    const group = this.groupRepository.create({
      name,
      cityCode,
      activityTime,
      members,
      expiresAt: activityTime, // Auto-expire logic would be more complex
    });
    return this.groupRepository.save(group);
  }

  async getActivities(cityCode: string): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { cityCode, active: true },
    });
  }
}
