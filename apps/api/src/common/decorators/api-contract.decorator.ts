import { SetMetadata } from '@nestjs/common';

export const API_CONTRACT_KEY = 'apiContract';

/**
 * Decorator to define API contract for endpoints
 * Used for validation and documentation
 */
export const ApiContract = (contract: {
  request?: any;
  response: any;
  description?: string;
}) => SetMetadata(API_CONTRACT_KEY, contract);
