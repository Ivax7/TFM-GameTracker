import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGame } from './user-game.entity';
import { GameService } from '../game/game.service';
import { User } from '../user/user.entity';

export type GameStatus = 'Playing' | 'Played' | 'Completed' | 'Abandoned';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(UserGame)
    private repo: Repository<UserGame>,  // ✅ usar esta variable en vez de userGameRepository
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
  async setReview(userId: number, gameId: number, review: string) {
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
      gameName: game.name,
      review,
    });
  } else {
    userGame.review = review;
  }

  return this.repo.save(userGame);
}

}
