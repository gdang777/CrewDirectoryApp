import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * API Contract Guard
 * Validates that API responses match expected contracts
 * This helps catch breaking changes early
 */
@Injectable()
export class ApiContractGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Store original json method
    const originalJson = response.json.bind(response);

    // Override json to validate response
    response.json = function (body: any) {
      // Validate response structure if contract is defined
      // This is a placeholder - implement based on your needs
      return originalJson(body);
    };

    return true;
  }
}
