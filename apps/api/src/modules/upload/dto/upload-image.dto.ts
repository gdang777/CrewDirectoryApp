import { IsString, IsEnum } from 'class-validator';

export enum ImageCategory {
  PLACES = 'places',
  CITIES = 'cities',
  AVATARS = 'avatars',
  PROPERTIES = 'properties',
}

export class UploadImageDto {
  @IsEnum(ImageCategory)
  category: ImageCategory;
}

export class ImageUploadResponse {
  imageUrl: string;
}
