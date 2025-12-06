import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserGame } from '../user-game/user-game.entity';

@Injectable()
export class UserReviewsService {
  constructor(
    @InjectRepository(UserGame)
    private userGameRepo: Repository<UserGame>,
  ) {}

  async getReviewsByUser(userId: number) {
    console.log('Buscando reviews para userId:', userId);
  
    const reviews = await this.userGameRepo.find({
      where: { user: { id: userId }, review: Not('') },
      relations: ['game'],
      order: { createdAt: 'DESC' },
    });
  
    console.log('Reviews encontradas en BD:', reviews);
  
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
