import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowService } from './follow.service';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id')
  async follow(@Req() req, @Param('id') id: number) {
    return this.followService.followUser(req.user.userId, id);
  }

  @Delete(':id')
  async unfollow(@Req() req, @Param('id') id: number) {
    return this.followService.unfollowUser(req.user.userId, id);
  }

  @Get('followers/:id')
  async followers(@Param('id') id: number) {
    return this.followService.getFollowers(id);
  }

  @Get('following/:id')
  async following(@Param('id') id: number) {
    return this.followService.getFollowing(id);
  }

  @Get('is-following/:id')
  async isFollowing(@Req() req, @Param('id') id: number) {
    return this.followService.isFollowing(req.user.userId, id);
  }
}
