import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class VoteDto {
  @IsString()
  @IsNotEmpty()
  playbookId: string;

  @IsInt()
  @Min(-1)
  @Max(1)
  value: number; // 1 for upvote, -1 for downvote
}
