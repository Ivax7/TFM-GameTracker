import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =========================
  // PERFIL PRIVADO
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.userService.findByIdWithRelations(req.user.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapUser(user);
  }

  // =========================
  // ACTUALIZAR PERFIL
  // =========================
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: memoryStorage(), // 👈 MUY IMPORTANTE
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Patch('profile')
  async updateProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const updateData: any = {
      displayName: body.displayName,
      bio: body.bio,
      username: body.username,
      email: body.email,
    };

    // 👇 SUBIDA A CLOUDINARY
    if (file) {
      const imageUrl =
        await this.cloudinaryService.uploadProfileImage(file);
      updateData.profileImage = imageUrl; // guardamos URL completa
    }

    const updated = await this.userService.updateProfile(
      req.user.userId,
      updateData,
    );

    if (!updated) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapUser(updated);
  }

  // =========================
  // BORRAR PERFIL
  // =========================
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const deleted = await this.userService.deleteUser(req.user.userId);
    if (!deleted) {
      throw new UnauthorizedException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  // =========================
  // BÚSQUEDA DE USUARIOS
  // =========================
  @Get('search')
  async searchUsers(@Query('q') q: string) {
    const users = await this.userService.searchUsers(q);
    return users.map((u) => this.mapUser(u));
  }

  @Get('all')
  async getAllUsers() {
    const users = await this.userService.searchUsers('');
    return users.map((u) => this.mapUser(u));
  }

  // =========================
  // PERFIL PÚBLICO
  // =========================
  @Get('username/:username')
  async getPublicProfile(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapUser(user);
  }

  // =========================
  // MAPEO UNIFICADO
  // =========================
// En user.controller.ts
  private mapUser(user: any) {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName || '',
      bio: user.bio || '',
      email: user.email || null,
      // La URL ya debería venir completa desde Cloudinary
      profileImage: user.profileImage || null,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }
}
