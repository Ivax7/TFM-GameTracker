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
      name: string;
      backgroundImage?: string;
      released?: string;
      rating?: number;
      status: string;
    },
  ) {
    const userId = req.user.id;
    return this.userGameService.setStatus(
      userId,
      body.gameId,
      body.status as 'Playing' | 'Played' | 'Completed' | 'Abandoned',
      body.name,
      body.backgroundImage,
      body.released,
      body.rating,
    );
  }

  // Obtener juegos filtrados por estado
  @Get(':status')
  async getGamesByStatus(@Req() req: AuthRequest, @Param('status') status: string) {
    const userId = req.user.id;
    return this.userGameService.findByStatus(
      userId,
      status as 'Playing' | 'Played' | 'Completed' | 'Abandoned',
    );
  }

  // Obtener el status de un juego concreto
  @Get('status/:gameId')
  async getGameStatus(@Req() req: AuthRequest, @Param('gameId') gameId: number) {
    const userId = req.user.id;
    const userGame = await this.userGameService.findUserGameById(userId, gameId);

    return {
      status: userGame?.status || null,
      rating: userGame?.rating ?? null,
    };
  }

  // Endpoint para guardar el rating
  @Post('rating')
  async setRating(
    @Req() req: AuthRequest,
    @Body() body: { gameId: number; rating: number },
  ) {
    const userId = req.user.id;
    return this.userGameService.setRating(userId, body.gameId, body.rating);
  }
}
