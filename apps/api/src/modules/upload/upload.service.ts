import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;
  private readonly bucketName = 'crew-lounge-images';
  private readonly maxFileSizeMB = 5;
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.getSupabaseUrl();
    const supabaseKey = this.getSupabaseServiceKey();

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        'Supabase credentials not configured. Image uploads will fail.'
      );
    }

    this.supabase = createClient(supabaseUrl || '', supabaseKey || '', {
      auth: {
        persistSession: false,
      },
    });
  }

  /**
   * Extract Supabase URL from DATABASE_URL
   * Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   */
  private getSupabaseUrl(): string {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      return '';
    }

    // Extract project reference from database URL
    const match = databaseUrl.match(/postgres\.([a-z0-9]+):/);
    if (match && match[1]) {
      const projectRef = match[1];
      return `https://${projectRef}.supabase.co`;
    }

    // Fallback: check for direct SUPABASE_URL env var
    return this.configService.get<string>('SUPABASE_URL') || '';
  }

  /**
   * Get Supabase service role key
   * This should be added to .env as SUPABASE_SERVICE_KEY
   */
  private getSupabaseServiceKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_KEY') || '';
  }

  /**
   * Validate uploaded file
   */
  validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.maxFileSizeMB) {
      throw new BadRequestException(
        `File size exceeds ${this.maxFileSizeMB}MB limit`
      );
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${this.allowedMimeTypes.join(', ')}`
      );
    }
  }

  /**
   * Upload image to Supabase Storage
   * @param file - Uploaded file from multer
   * @param category - Image category (places, cities, avatars, properties)
   * @returns Public URL of uploaded image
   */
  async uploadImage(
    file: Express.Multer.File,
    category: string
  ): Promise<string> {
    this.validateImage(file);

    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}-${Date.now()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    try {
      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new BadRequestException(
          `Failed to upload image: ${error.message}`
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(
        'Failed to upload image. Please try again.'
      );
    }
  }

  /**
   * Delete image from Supabase Storage
   * @param imageUrl - Full URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.includes(this.bucketName)) {
      // Not a Supabase Storage URL, skip deletion
      return;
    }

    try {
      // Extract file path from URL
      // Format: https://PROJECT.supabase.co/storage/v1/object/public/crew-lounge-images/places/uuid-timestamp.jpg
      const urlParts = imageUrl.split(`${this.bucketName}/`);
      if (urlParts.length < 2) {
        console.warn('Invalid image URL format:', imageUrl);
        return;
      }

      const filePath = urlParts[1];

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Failed to delete image:', error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Don't throw - deletion is non-critical
    }
  }
}
