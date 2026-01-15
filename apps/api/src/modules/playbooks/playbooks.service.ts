import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playbook, City, POI, PlaybookEdit, Vote, User } from './entities';
import { CreatePlaybookDto, CreatePOIDto, CreateEditDto, VoteDto } from './dto';

@Injectable()
export class PlaybooksService {
  constructor(
    @InjectRepository(Playbook)
    private playbookRepository: Repository<Playbook>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(POI)
    private poiRepository: Repository<POI>,
    @InjectRepository(PlaybookEdit)
    private editRepository: Repository<PlaybookEdit>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(cityId?: string): Promise<Playbook[]> {
    const query = this.playbookRepository.createQueryBuilder('playbook')
      .leftJoinAndSelect('playbook.city', 'city')
      .leftJoinAndSelect('playbook.pois', 'pois');

    if (cityId) {
      query.where('playbook.cityId = :cityId', { cityId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Playbook> {
    const playbook = await this.playbookRepository.findOne({
      where: { id },
      relations: ['city', 'pois', 'edits'],
    });

    if (!playbook) {
      throw new NotFoundException(`Playbook with ID ${id} not found`);
    }

    return playbook;
  }

  async create(createDto: CreatePlaybookDto, userId: string): Promise<Playbook> {
    const city = await this.cityRepository.findOne({
      where: { id: createDto.cityId },
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${createDto.cityId} not found`);
    }

    const playbook = this.playbookRepository.create({
      ...createDto,
      city,
    });

    return this.playbookRepository.save(playbook);
  }

  async createPOI(createDto: CreatePOIDto): Promise<POI> {
    const playbook = await this.playbookRepository.findOne({
      where: { id: createDto.playbookId },
    });

    if (!playbook) {
      throw new NotFoundException(
        `Playbook with ID ${createDto.playbookId} not found`,
      );
    }

    const poi = this.poiRepository.create({
      ...createDto,
      playbook,
    });

    return this.poiRepository.save(poi);
  }

  async findPOIsNearby(
    lat: number,
    lng: number,
    radiusKm: number = 5,
  ): Promise<POI[]> {
    // PostGIS query to find POIs within radius
    return this.poiRepository
      .createQueryBuilder('poi')
      .where(
        `ST_DWithin(
          poi.coordinates::geography,
          ST_MakePoint(:lng, :lat)::geography,
          :radius
        )`,
        { lng, lat, radius: radiusKm * 1000 },
      )
      .getMany();
  }

  async createEdit(createDto: CreateEditDto, userId: string): Promise<PlaybookEdit> {
    const playbook = await this.playbookRepository.findOne({
      where: { id: createDto.playbookId },
    });

    if (!playbook) {
      throw new NotFoundException(
        `Playbook with ID ${createDto.playbookId} not found`,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const edit = this.editRepository.create({
      ...createDto,
      playbook,
      user,
    });

    return this.editRepository.save(edit);
  }

  async vote(voteDto: VoteDto, userId: string): Promise<Vote> {
    const existingVote = await this.voteRepository.findOne({
      where: {
        userId,
        playbookId: voteDto.playbookId,
      },
    });

    if (existingVote) {
      // Update existing vote
      existingVote.value = voteDto.value;
      await this.voteRepository.save(existingVote);
      await this.updatePlaybookVoteCount(voteDto.playbookId);
      return existingVote;
    }

    const playbook = await this.playbookRepository.findOne({
      where: { id: voteDto.playbookId },
    });

    if (!playbook) {
      throw new NotFoundException(
        `Playbook with ID ${voteDto.playbookId} not found`,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const vote = this.voteRepository.create({
      ...voteDto,
      playbook,
      user,
    });

    await this.voteRepository.save(vote);
    await this.updatePlaybookVoteCount(voteDto.playbookId);

    // Update user karma
    await this.updateUserKarma(userId, voteDto.value);

    return vote;
  }

  private async updatePlaybookVoteCount(playbookId: string): Promise<void> {
    const result = await this.voteRepository
      .createQueryBuilder('vote')
      .select('SUM(vote.value)', 'total')
      .where('vote.playbookId = :playbookId', { playbookId })
      .getRawOne();

    const total = parseInt(result.total) || 0;
    const upvotes = await this.voteRepository.count({
      where: { playbookId, value: 1 },
    });
    const downvotes = await this.voteRepository.count({
      where: { playbookId, value: -1 },
    });

    await this.playbookRepository.update(playbookId, {
      upvotes,
      downvotes,
    });
  }

  private async updateUserKarma(userId: string, voteValue: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      // Karma increases with upvotes received, decreases with downvotes
      // This is simplified - actual karma calculation might be more complex
      user.karmaScore += voteValue;
      await this.userRepository.save(user);
    }
  }

  async findAllCities(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async findCityByCode(code: string): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { code },
    });

    if (!city) {
      throw new NotFoundException(`City with code ${code} not found`);
    }

    return city;
  }
}
