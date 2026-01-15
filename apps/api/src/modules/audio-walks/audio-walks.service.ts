import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AudioWalk,
  Waypoint,
  AudioFile,
  Translation,
  Purchase,
} from './entities';

@Injectable()
export class AudioWalksService {
  constructor(
    @InjectRepository(AudioWalk)
    private audioWalkRepository: Repository<AudioWalk>,
    @InjectRepository(Waypoint)
    private waypointRepository: Repository<Waypoint>,
    @InjectRepository(AudioFile)
    private audioFileRepository: Repository<AudioFile>,
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
  ) {}

  async findAll(cityCode?: string): Promise<AudioWalk[]> {
    const query = this.audioWalkRepository
      .createQueryBuilder('walk')
      .leftJoinAndSelect('walk.creator', 'creator')
      .leftJoinAndSelect('walk.waypoints', 'waypoints')
      .where('walk.active = :active', { active: true });

    if (cityCode) {
      query.andWhere('walk.cityCode = :cityCode', { cityCode });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<AudioWalk> {
    const walk = await this.audioWalkRepository.findOne({
      where: { id },
      relations: ['creator', 'waypoints', 'audioFiles'],
    });

    if (!walk) {
      throw new NotFoundException(`Audio walk with ID ${id} not found`);
    }

    return walk;
  }

  async create(
    createDto: Partial<AudioWalk>,
    creatorId: string,
  ): Promise<AudioWalk> {
    const walk = this.audioWalkRepository.create({
      ...createDto,
      creatorId,
    });
    return this.audioWalkRepository.save(walk);
  }

  async addWaypoint(
    audioWalkId: string,
    waypointData: Partial<Waypoint>,
  ): Promise<Waypoint> {
    const walk = await this.audioWalkRepository.findOne({
      where: { id: audioWalkId },
    });

    if (!walk) {
      throw new NotFoundException(
        `Audio walk with ID ${audioWalkId} not found`,
      );
    }

    const waypoint = this.waypointRepository.create({
      ...waypointData,
      audioWalk: walk,
    });
    return this.waypointRepository.save(waypoint);
  }

  async uploadAudioFile(
    audioWalkId: string,
    url: string,
    language: string,
    duration: number,
  ): Promise<AudioFile> {
    const walk = await this.audioWalkRepository.findOne({
      where: { id: audioWalkId },
    });

    if (!walk) {
      throw new NotFoundException(
        `Audio walk with ID ${audioWalkId} not found`,
      );
    }

    const file = this.audioFileRepository.create({
      audioWalk: walk,
      url,
      language,
      duration,
    });
    return this.audioFileRepository.save(file);
  }

  async purchase(audioWalkId: string, userId: string): Promise<Purchase> {
    const walk = await this.audioWalkRepository.findOne({
      where: { id: audioWalkId },
    });

    if (!walk) {
      throw new NotFoundException(
        `Audio walk with ID ${audioWalkId} not found`,
      );
    }

    const creatorRevenue = walk.price * 0.7; // 70% to creator

    const purchase = this.purchaseRepository.create({
      audioWalk: walk,
      userId,
      amount: walk.price,
      currency: 'USD', // Would be dynamic
      creatorRevenue,
    });

    return this.purchaseRepository.save(purchase);
  }

  async getWaypointForLocation(
    audioWalkId: string,
    lat: number,
    lng: number,
  ): Promise<Waypoint | null> {
    // Find waypoint within trigger radius using PostGIS
    const waypoint = await this.waypointRepository
      .createQueryBuilder('waypoint')
      .where('waypoint.audioWalkId = :audioWalkId', { audioWalkId })
      .andWhere(
        `ST_DWithin(
          waypoint.coordinates::geography,
          ST_MakePoint(:lng, :lat)::geography,
          COALESCE(waypoint."triggerRadius", 50)
        )`,
        { lng, lat },
      )
      .orderBy('waypoint.order', 'ASC')
      .getOne();

    return waypoint;
  }
}
