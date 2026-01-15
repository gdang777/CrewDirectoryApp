import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreatePlaybookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['basic', 'pro'])
  @IsOptional()
  tier?: 'basic' | 'pro';

  @IsString()
  @IsNotEmpty()
  cityId: string;
}
