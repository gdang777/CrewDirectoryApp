import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      authorizationURL: configService.get<string>(
        'OAUTH_AUTHORIZATION_URL',
        'https://airline-portal.example.com/oauth/authorize',
      ),
      tokenURL: configService.get<string>(
        'OAUTH_TOKEN_URL',
        'https://airline-portal.example.com/oauth/token',
      ),
      clientID: configService.get<string>('OAUTH_CLIENT_ID', ''),
      clientSecret: configService.get<string>('OAUTH_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>(
        'OAUTH_CALLBACK_URL',
        'http://localhost:3001/auth/oauth/callback',
      ),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Extract airline ID from profile (implementation depends on airline portal)
    const airlineId = profile?.airlineId || profile?.employeeId;
    const email = profile?.email || profile?.emails?.[0]?.value;

    if (!email) {
      return done(new Error('Email not found in profile'), null);
    }

    const user = await this.authService.validateUser(email, airlineId);
    return done(null, user);
  }
}
