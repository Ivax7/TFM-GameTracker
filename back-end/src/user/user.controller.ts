import { Controller, Get, Patch, Delete, Body, Req, UseGuards, UnauthorizedException, UseInterceptors, UploadedFile, Query, Param } from '@nestjs/common';
import { Multer } from 'multer';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NotFoundException } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET PROFILE
  // PERFIL PRIVADO CON CONTADORES DE FOLLOWERS/FOLLOWING
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');

    const userId = req.user.userId;
    const user = await this.userService.findByIdWithRelations(userId);

    if (!user) throw new UnauthorizedException('User not found');

    const baseUrl = 'http://localhost:3000/uploads/';

    return {
      id: user.id,
      displayName: user.displayName || '',
      bio: user.bio || '',
      email: user.email,
      username: user.username,
      profileImage: user.profileImage ? baseUrl + user.profileImage : null,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }


  // UPDATE PROFILE WITH IMAGE UPLOAD
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profile', // Carpeta donde se guardan las imágenes
        filename: (req, file, cb) => {
          // Generamos un nombre único
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // peso máximo
    }),
  )

  // Actualizar perfil
  @Patch('profile')
  async updateProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');

    const userId = req.user.userId;

    const updateData: any = {
      displayName: body.displayName,
      bio: body.bio,
      username: body.username,
      email: body.email,
    };

    if (file) {
      updateData.profileImage = file.filename;
    }

    const updated = await this.userService.updateProfile(userId, updateData);

    if (!updated) {
      throw new UnauthorizedException('User not found');
    }

    return {
      displayName: updated.displayName || '',
      bio: updated.bio || '',
      email: updated.email,
      username: updated.username,
      profileImage: updated.profileImage || null,
    };
  }

  // Borrar Perfil
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    const userId = req.user.userId;
    const deleted = await this.userService.deleteUser(userId);

    if (!deleted) {
      throw new UnauthorizedException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  @Get('search')
  async searchUsers(@Query('q') q: string) {
    return this.userService.searchUsers(q);
  }

  @Get('all')
  async getAllUsers() {
    return this.userService.searchUsers('');
  }

  // Get del usuario por nombre para ver el perfil
  @Get('username/:username')
  async getPublicProfile(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      profileImage: user.profileImage ? `http://localhost:3000/uploads/${user.profileImage}` : null,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }


}
