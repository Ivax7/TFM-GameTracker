import { Controller, Get, Patch, Delete, Body, Req, UseGuards, UnauthorizedException, UseInterceptors, UploadedFile, Query, Param, NotFoundException } from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  private readonly baseUrl = 'http://localhost:3000/uploads/profile/'; // URL base para las imágenes

  constructor(private readonly userService: UserService) {}

  // PERFIL PRIVADO
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');

    const user = await this.userService.findByIdWithRelations(req.user.userId);
    if (!user) throw new UnauthorizedException('User not found');

    return this.mapUser(user);
  }

  // ACTUALIZAR PERFIL
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, cb) => {
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
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Patch('profile')
  async updateProfile(@Req() req, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');

    const updateData: any = {
      displayName: body.displayName,
      bio: body.bio,
      username: body.username,
      email: body.email,
    };
    if (file) updateData.profileImage = file.filename;

    const updated = await this.userService.updateProfile(req.user.userId, updateData);
    if (!updated) throw new UnauthorizedException('User not found');

    return this.mapUser(updated);
  }

  // BORRAR PERFIL
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    const deleted = await this.userService.deleteUser(req.user.userId);
    if (!deleted) throw new UnauthorizedException('User not found');
    return { message: 'User deleted successfully' };
  }

  // BÚSQUEDA DE USUARIOS
  @Get('search')
  async searchUsers(@Query('q') q: string) {
    const users = await this.userService.searchUsers(q);
    return users.map(u => this.mapUser(u));
  }

  @Get('all')
  async getAllUsers() {
    const users = await this.userService.searchUsers('');
    return users.map(u => this.mapUser(u));
  }

  // PERFIL PÚBLICO
  @Get('username/:username')
  async getPublicProfile(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    return this.mapUser(user);
  }

  // Mapeo uniforme de usuario para devolver URL completa de imagen
  private mapUser(user: any) {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName || '',
      bio: user.bio || '',
      email: user.email || null,
      profileImage: user.profileImage ? this.baseUrl + user.profileImage : null,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }
}
