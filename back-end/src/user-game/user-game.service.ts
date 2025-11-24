import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Raw } from 'typeorm';
import { UserGame } from './user-game.entity';
import { GameService } from '../game/game.service';
import { User } from '../user/user.entity';

export type GameStatus = 'Playing' | 'Played' | 'Completed' | 'Abandoned';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(UserGame)
    private repo: Repository<UserGame>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly gameService: GameService,
  ) {}

  // Crear o actualizar status y gameName
async setStatus(
  userId: number,
  gameId: number,
  status: GameStatus,
  gameName?: string,
  backgroundImage?: string,
  released?: string,
  rating?: number
) {
  const game = await this.gameService.findOrCreate({
    id: gameId,
    name: gameName,
    backgroundImage,
    released,
    rating,
  });

  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  let userGame = await this.repo.findOne({
    where: { user: { id: userId }, game: { id: gameId } },
    relations: ['user', 'game'],
  });

  if (!userGame) {
    // Crear si no existía
    userGame = this.repo.create({
      user,
      game,
      status,
      gameName: game.name || 'Unknown Game',
    });
  } else {
    // Actualizar si ya existía
    userGame.status = status;
    userGame.gameName = game.name || 'Unknown Game';
  }

  return this.repo.save(userGame); // Siempre guarda en BD
}


  // Guardar rating
async setRating(userId: number, gameId: number, rating: number) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const game = await this.gameService.findOrCreate({ id: gameId });

  let userGame = await this.repo.findOne({
    where: { user: { id: userId }, game: { id: gameId } },
    relations: ['user', 'game'],
  });

  if (!userGame) {
    userGame = this.repo.create({
      user,
      game,
      status: 'Playing',
      gameName: game.name || 'Unknown Game',
      rating,
    });
  } else {
    userGame.rating = rating;
  }

  return this.repo.save(userGame);
}

  
  async findByStatus(userId: number, status: GameStatus) {
    return this.repo.find({
      where: { user: { id: userId }, status },
      relations: ['game'],
    });
  }

  // Obtener un juego concreto
  async findUserGameById(userId: number, gameId: number) {
    return this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
      relations: ['game'],
    });
  }
  
  async setPlaytime(userId: number, gameId: number, playtime: number) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const game = await this.gameService.findOrCreate({ id: gameId });

  let userGame = await this.repo.findOne({
    where: { user: { id: userId }, game: { id: gameId } },
    relations: ['user', 'game'],
  });

  if (!userGame) {
    userGame = this.repo.create({
      user,
      game,
      status: 'Playing',
      gameName: game.name || 'Unknown Game',
      playtime,
    });
  } else {
    userGame.playtime = playtime;
  }

  return this.repo.save(userGame);
  }

    /* REVIEWS */
  /** Guardar review, hasta un máximo de 3 por usuario por juego */
async setReview(userId: number, gameId: number, review: string) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const game = await this.gameService.findOrCreate({ id: gameId });

  // Buscar registros existentes del usuario para este juego
  const userGames = await this.repo.find({
    where: { user: { id: userId }, game: { id: gameId } },
    order: { createdAt: 'ASC' },
  });

  // Contar cuántos reviews ya tiene
  const reviewsCount = userGames.filter(ug => ug.review && ug.review.trim() !== '').length;

  if (reviewsCount >= 3) {
    throw new Error('You have reached the maximum number of reviews for this game (3).');
  }

  // Buscar un registro sin review para reutilizar o crear uno nuevo
  let target: UserGame | undefined = userGames.find(ug => !ug.review || ug.review.trim() === '');
  if (!target) {
    target = this.repo.create({
      user,
      game,
      status: 'Playing',
      gameName: game.name,
    });
  }

  target.review = review;

  return this.repo.save(target);
}


  /** Obtener todas las reviews de un juego */
  async getReviewsForGame(gameId: number) {
    const reviews = await this.repo.find({
      where: { game: { id: gameId }, review: Not('') },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map(r => ({
      id: r.id,
      username: r.user.username,
      review: r.review,
      rating: r.rating,
      playtime: r.playtime,
      createdAt: r.createdAt,
    }));
  }
}
