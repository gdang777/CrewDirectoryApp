import { IsString, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
