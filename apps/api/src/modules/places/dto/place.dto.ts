import {
  IsString,
  IsOptional,
  IsIn,
  IsUrl,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { PlaceCategory } from '../entities/place.entity';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  tips?: string;

  @IsIn(['eat', 'drink', 'shop', 'visit'])
  category: PlaceCategory;

  @IsUUID()
  cityId: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tips?: string;

  @IsOptional()
  @IsIn(['eat', 'drink', 'shop', 'visit'])
  category?: PlaceCategory;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
