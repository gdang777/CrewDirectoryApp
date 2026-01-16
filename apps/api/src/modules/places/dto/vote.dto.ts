import { IsInt, IsIn } from 'class-validator';

export class VotePlaceDto {
  @IsInt()
  @IsIn([1, -1])
  value: number; // 1 for upvote, -1 for downvote
}
