import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
