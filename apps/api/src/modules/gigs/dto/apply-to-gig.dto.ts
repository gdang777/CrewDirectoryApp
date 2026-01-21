import { IsString, IsOptional } from 'class-validator';

export class ApplyToGigDto {
  @IsOptional()
  @IsString()
  message?: string;
}
