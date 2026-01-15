import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEditDto {
  @IsString()
  @IsNotEmpty()
  playbookId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  changeDescription?: string;
}
