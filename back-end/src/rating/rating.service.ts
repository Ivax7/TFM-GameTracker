import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { UserGame } from 'src/user-game/user-game.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(UserGame)
    private userGameRepo: Repository<UserGame>,
  ) {}

  // Obtener todos los ratings de un usuario
  getRatingsByUser(userId: number) {
    return this.userGameRepo.find({
      where: { user: { id: userId }, rating: Not(IsNull()) },
      relations: ['game'],
      order: { createdAt: 'DESC' },
    });
  }
}
