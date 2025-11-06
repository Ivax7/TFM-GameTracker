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
    private repo: Repository<UserGame>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly gameService: GameService,
  ) {}

  async setStatus(
    userId: number,
    gameId: number,
    status: GameStatus,
    name?: string,
    backgroundImage?: string,
    released?: string,
    rating?: number,
  ) {
    const game = await this.gameService.findOrCreate({
      id: gameId,
      name: name || 'Unknown Game',
      backgroundImage,
      released,
      rating,
    });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error(`User with id ${userId} not found`);
    let userGame = await this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
    });
    if (!userGame) {
      userGame = this.repo.create({ user, game, status });
    } else {
      userGame.status = status;
    }
    await this.repo.save(userGame);
    return this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
      relations: ['game'],
    });
  }
  async findByStatus(userId: number, status: GameStatus) {
    return this.repo.find({
      where: { user: { id: userId }, status },
      relations: ['game'],
    });
  }
}
