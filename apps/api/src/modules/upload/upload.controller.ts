import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadImageDto, ImageUploadResponse } from './dto/upload-image.dto';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadImageDto
  ): Promise<ImageUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = await this.uploadService.uploadImage(
      file,
      uploadDto.category
    );

    return { imageUrl };
  }

  @Delete('image')
  async deleteImage(
    @Body('imageUrl') imageUrl: string
  ): Promise<{ success: boolean }> {
    if (!imageUrl) {
      throw new BadRequestException('Image URL is required');
    }

    await this.uploadService.deleteImage(imageUrl);
    return { success: true };
  }
}
