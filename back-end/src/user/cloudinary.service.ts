// cloudinary.service.ts - Versión sin streamifier
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    try {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
        base64Image,
        {
          folder: 'profile_images',
          public_id: `profile_${Date.now()}`,
          resource_type: 'image',
        }
      );
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<string> {
    try {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const result = await cloudinary.uploader.upload(base64Image, {
        folder,
        public_id: `${folder}_${Date.now()}`,
        resource_type: 'auto',
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}