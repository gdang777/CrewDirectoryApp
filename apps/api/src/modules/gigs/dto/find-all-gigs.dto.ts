import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GigCategory } from '../entities/gig.entity';

export class FindAllGigsDto {
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsString()
  cityCode?: string;

  @IsOptional()
  @IsEnum(['hospitality', 'retail', 'events', 'services', 'other'])
  category?: GigCategory;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPayRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPayRate?: number;

  @IsOptional()
  @IsEnum(['hourly', 'daily', 'fixed'])
  payType?: string;

  @IsOptional()
  @IsEnum(['active', 'filled', 'expired'])
  status?: string;

  @IsOptional()
  @IsEnum(['newest', 'oldest', 'pay_high', 'pay_low', 'popular'])
  sortBy?: 'newest' | 'oldest' | 'pay_high' | 'pay_low' | 'popular';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
