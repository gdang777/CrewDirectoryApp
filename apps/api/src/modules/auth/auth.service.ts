import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../playbooks/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const { email, password, firstName, lastName, airline } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      airlineId: airline,
      verifiedBadge: false,
      karmaScore: 0,
    });

    const savedUser = await this.userRepository.save(user);

    return this.login(savedUser);
  }

  async validateUserCredentials(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.password) {
      throw new BadRequestException(
        'This account uses OAuth login. Please sign in with your airline portal.'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async validateUser(email: string, airlineId?: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Create new user if doesn't exist (for OAuth)
      user = this.userRepository.create({
        email,
        name: email.split('@')[0],
        airlineId,
        verifiedBadge: !!airlineId,
      });
      user = await this.userRepository.save(user);
    } else if (airlineId && !user.airlineId) {
      user.airlineId = airlineId;
      user.verifiedBadge = true;
      await this.userRepository.save(user);
    }

    return user;
  }

  login(user: User): { access_token: string; user: Partial<User> } {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      airlineId: user.airlineId,
      verifiedBadge: user.verifiedBadge,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        airlineId: user.airlineId,
        verifiedBadge: user.verifiedBadge,
        karmaScore: user.karmaScore,
      },
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
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
