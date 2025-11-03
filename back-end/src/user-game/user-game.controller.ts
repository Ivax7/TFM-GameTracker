import { Controller, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserGameService } from './user-game.service';

@Controller('user-game')
export class UserGameController {
  constructor(private readonly service: UserGameService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('status')
  async updateStatus(@Req() req, @Body() body: { gameId: number; status: 'Playing' | 'Played' | 'Completed' | 'Abandoned' }) {
    const userId = req.user.id;
    return this.service.setStatus(userId, body.gameId, body.status);
  }
}
