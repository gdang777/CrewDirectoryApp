import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { Point } from 'geojson';

export class CreatePOIDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsObject()
  @IsNotEmpty()
  coordinates: Point;

  @IsString()
  @IsNotEmpty()
  playbookId: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
