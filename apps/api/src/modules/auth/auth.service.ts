import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../playbooks/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, airlineId?: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = this.userRepository.create({
        email,
        name: email.split('@')[0], // Default name from email
        airlineId,
        verifiedBadge: !!airlineId, // Verified if has airline ID
      });
      user = await this.userRepository.save(user);
    } else if (airlineId && !user.airlineId) {
      // Update user with airline ID if provided
      user.airlineId = airlineId;
      user.verifiedBadge = true;
      await this.userRepository.save(user);
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      airlineId: user.airlineId,
      verifiedBadge: user.verifiedBadge,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        airlineId: user.airlineId,
        verifiedBadge: user.verifiedBadge,
        karmaScore: user.karmaScore,
      },
    };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async revokeVerificationBadge(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      verifiedBadge: false,
    });
  }
}
