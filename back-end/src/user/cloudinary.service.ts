// cloudinary.service.ts - Versión simplificada y funcional
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Carga las variables de entorno
dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configura Cloudinary directamente
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    // Log para debug
    console.log('✅ Cloudinary configurado:', {
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'NO',
    });
  }

  async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'profiles',
          transformation: [
            { width: 256, height: 256, crop: 'fill', gravity: 'face' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary error:', error.message);
            reject(error);
          } else {
            console.log('✅ Imagen subida:', result.secure_url);
            resolve(result.secure_url);
          }
        }
      );
    });
  }
}