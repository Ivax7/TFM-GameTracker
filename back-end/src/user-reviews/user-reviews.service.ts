import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserGame } from '../user-game/user-game.entity';

@Injectable()
export class UserReviewsService {
  constructor(
    @InjectRepository(UserGame)
    private readonly userGameRepo: Repository<UserGame>,
  ) {}

  async getReviewsByUser(userId: number) {
    const reviews = await this.userGameRepo.find({
      where: {
        user: { id: userId },
        review: Not(''),
      },
      relations: ['game'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map(r => ({
      id: r.id,
      gameId: r.game.id,
      name: r.gameName || r.game.name,
      backgroundImage: r.game.backgroundImage,
      review: r.review,
      rating: r.rating,
      playtime: r.playtime,
      createdAt: r.updatedAt,
    }));
  }
}
