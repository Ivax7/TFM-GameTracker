import { Controller, Get, Patch, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    console.log('req.user:', req.user);

    if (!req.user) throw new UnauthorizedException('User not authenticated');

    const userId = req.user.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      displayName: user.displayName || '',
      bio: user.bio || '',
      email: user.email,
      username: user.username,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req,
    @Body() body: { displayName?: string; bio?: string }
  ) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');

    const userId = req.user.userId;
    const user = await this.userService.updateProfile(userId, body);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      displayName: user.displayName || '',
      bio: user.bio || '',
      email: user.email,
      username: user.username,
    };
  }
}
