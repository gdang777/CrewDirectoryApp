import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUserCredentials(loginDto);
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      airlineId: req.user.airlineId,
      verifiedBadge: req.user.verifiedBadge,
      karmaScore: req.user.karmaScore,
    };
  }

  @Get('oauth')
  @UseGuards(AuthGuard('oauth2'))
  async oauth() {
    // Initiates OAuth flow
  }

  @Get('oauth/callback')
  @UseGuards(AuthGuard('oauth2'))
  async oauthCallback(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Request() req: any) {
    return {
      user: req.user,
      verified: req.user.verifiedBadge,
    };
  }

  @Post('revoke-verification')
  @UseGuards(JwtAuthGuard)
  async revokeVerification(@Request() req: any) {
    await this.authService.revokeVerificationBadge(req.user.id);
    return { message: 'Verification badge revoked' };
  }

  // Dev-only login endpoint for testing
  @Post('dev/login')
  async devLogin(@Body() body: { email: string; airlineId?: string }) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Not available in production');
    }
    const user = await this.authService.validateUser(
      body.email,
      body.airlineId
    );
    return this.authService.login(user);
  }
}
