import { Request } from 'express';
import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGameService } from './user-game.service';

interface AuthRequest extends Request {
  user: {
    userId: number;
    email?: string;
    username?: string;
  };
}

@Controller('user-games')
export class UserGameController {
  constructor(private readonly userGameService: UserGameService) {}

  // Endpoint público
  @Get(':gameId/reviews')
  async getReviews(@Param('gameId', ParseIntPipe) gameId: number) {
    return this.userGameService.getReviewsForGame(gameId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('status/:gameId')
  async getGameStatus(@Req() req: AuthRequest, @Param('gameId') gameId: number) {
    const userId = req.user.userId;
    const userGame = await this.userGameService.findUserGameById(userId, Number(gameId));

    return {
      status: userGame?.status || null,
      rating: userGame?.rating ?? null,
      playtime: userGame?.playtime ?? 0,
      review: userGame?.review ?? '',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('status')
  async setStatus(@Req() req: AuthRequest, @Body() body) {
    return this.userGameService.setStatus(
      req.user.userId,
      body.gameId,
      body.status,
      body.name,
      body.backgroundImage,
      body.released,
      body.rating,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':status')
  async getGamesByStatus(@Req() req: AuthRequest, @Param('status') status: string) {
    return this.userGameService.findByStatus(
      req.user.userId,
      status as 'Playing' | 'Played' | 'Completed' | 'Abandoned'
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rating')
  async setRating(@Req() req: AuthRequest, @Body() body) {
    return this.userGameService.setRating(req.user.userId, body.gameId, body.rating);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('playtime')
  async setPlaytime(@Req() req: AuthRequest, @Body() body) {
    return this.userGameService.setPlaytime(req.user.userId, body.gameId, body.playtime);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user-reviews')
  async getUserReviews(@Req() req: AuthRequest) {
    return this.userGameService.getReviewsByUser(req.user.userId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('review')
  async setReview(@Req() req: AuthRequest, @Body() body) {
    return this.userGameService.setReview(
      req.user.userId,
      body.gameId,
      body.review,
      body.name,
      body.backgroundImage,
      body.rating,
    );
  }

}
