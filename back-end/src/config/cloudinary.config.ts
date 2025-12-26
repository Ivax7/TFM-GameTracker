// // config/cloudinary.config.ts
// import { v2 as cloudinary } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CloudinaryConfig {
//   constructor(private configService: ConfigService) {
//     // Configura Cloudinary usando ConfigService
//     cloudinary.config({
//       cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
//       api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
//       api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
//       secure: true,
//     });

//     // Verificación
//     console.log('=== Cloudinary Configuration ===');
//     console.log('Cloud name:', this.configService.get<string>('CLOUDINARY_CLOUD_NAME'));
//     console.log('API Key exists:', !!this.configService.get<string>('CLOUDINARY_API_KEY'));
//     console.log('API Secret exists:', !!this.configService.get<string>('CLOUDINARY_API_SECRET'));
//     console.log('===============================');
//   }

//   getCloudinary() {
//     return cloudinary;
//   }
// }