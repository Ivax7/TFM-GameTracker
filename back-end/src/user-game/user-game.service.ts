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
  ) {
    let userGame = await this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
    });

    if (!userGame) {
      userGame = this.repo.create({
        user: { id: userId } as any,
        game: { id: gameId } as any,
        status,
        gameName: gameName || 'Unknown Game',
      });
    } else {
      userGame.status = status;
      if (gameName) userGame.gameName = gameName;
    }

    return this.repo.save(userGame);
  }

  // Guardar rating
  async setRating(userId: number, gameId: number, rating: number) {
    const userGame = await this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
    });

    if (!userGame) throw new Error('UserGame relation not found');

    userGame.rating = rating;
    return this.repo.save(userGame);
  }

  // Obtener juegos por status
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
}
