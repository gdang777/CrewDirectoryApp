import {
  IsString,
  IsOptional,
  IsIn,
  IsUrl,
  IsUUID,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { GigCategory, PayType } from '../entities/gig.entity';

export class CreateGigDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn(['hospitality', 'retail', 'events', 'services', 'other'])
  category: GigCategory;

  @IsUUID()
  cityId: string;

  @IsNumber()
  payRate: number;

  @IsIn(['hourly', 'daily', 'fixed'])
  payType: PayType;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateGigDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['hospitality', 'retail', 'events', 'services', 'other'])
  category?: GigCategory;

  @IsOptional()
  @IsNumber()
  payRate?: number;

  @IsOptional()
  @IsIn(['hourly', 'daily', 'fixed'])
  payType?: PayType;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsIn(['active', 'filled', 'expired', 'deleted'])
  status?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
