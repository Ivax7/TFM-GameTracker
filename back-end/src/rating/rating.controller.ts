import { Controller, Get, Param } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // Obtener ratings de un usuario (para su perfil)
  @Get('user/:userId')
  getRatingsByUser(@Param('userId') userId: number) {
    return this.ratingService.getRatingsByUser(userId);
  }
}
