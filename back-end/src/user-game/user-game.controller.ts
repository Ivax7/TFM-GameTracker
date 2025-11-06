import { Request } from 'express';
import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGameService } from './user-game.service';

interface AuthRequest extends Request {
  user: {
    id: number;
    email?: string;
    username?: string;
  };
}

@Controller('user-games')
@UseGuards(AuthGuard('jwt'))
export class UserGameController {
  constructor(private readonly userGameService: UserGameService) {}

  @Post('status')
  async setStatus(
    @Req() req: AuthRequest,
    @Body() body: { 
      gameId: number; 
      name?: string; 
      backgroundImage?: string; 
      status: string 
    },
  ) {
    const userId = req.user.id;
    return this.userGameService.setStatus(
      userId,
      body.gameId,
      body.status as 'Playing' | 'Played' | 'Completed' | 'Abandoned',
      body.name,
      body.backgroundImage, // ✅ añadimos esto
    );
  }

  @Get(':status')
  async getGamesByStatus(@Req() req: AuthRequest, @Param('status') status: string) {
    const userId = req.user.id;
    return this.userGameService.findByStatus(
      userId,
      status as 'Playing' | 'Played' | 'Completed' | 'Abandoned',
    );
  }
}
