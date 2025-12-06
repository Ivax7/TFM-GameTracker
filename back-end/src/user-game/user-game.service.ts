import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserGame } from './user-game.entity';
import { GameService } from '../game/game.service';
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';

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

  /** Crear o actualizar status y gameName */
  async setStatus(
    userId: number,
    gameId: number,
    status: GameStatus,
    gameName?: string,
    backgroundImage?: string,
    released?: string,
    rating?: number,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const game = await this.gameService.findOrCreate({
      id: gameId,
      name: gameName,
      backgroundImage,
      released,
      rating,
    });

    let userGame = await this.repo.findOne({
      where: { user: { id: userId }, game: { id: game.id } },
    });

    if (!userGame) {
      userGame = this.repo.create({
        user,
        game,
        status,
        gameName: game.name || 'Unknown Game',
      });
    } else {
      userGame.status = status;
      userGame.gameName = game.name || 'Unknown Game';
    }

    return this.repo.save(userGame);
  }

  async setRating(userId: number, gameId: number, rating: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const game = await this.gameService.findOrCreate({ id: gameId });

    let userGame = await this.repo.findOne({
      where: { user: { id: userId }, game: { id: game.id } },
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

  async setPlaytime(userId: number, gameId: number, playtime: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const game = await this.gameService.findOrCreate({ id: gameId });

    let userGame = await this.repo.findOne({
      where: { user: { id: userId }, game: { id: game.id } },
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

  async setReview(userId: number, gameId: number, review: string) {
    if (!review?.trim()) throw new Error('Review cannot be empty');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const game = await this.gameService.findOrCreate({ id: gameId });

    const existingReviews = await this.repo.find({
      where: { user: { id: userId }, game: { id: game.id } },
      order: { createdAt: 'ASC' },
    });

    const reviewCount = existingReviews.filter(r => r.review?.trim()).length;
    if (reviewCount >= 3) throw new Error('Maximum 3 reviews per game');

    let target = existingReviews.find(r => !r.review?.trim());
    if (!target) {
      target = this.repo.create({
        user,
        game,
        status: 'Playing',
        gameName: game.name || 'Unknown Game',
        review,
        rating: undefined,
        playtime: 0,
      });
    } else {
      target.review = review;
    }

    const saved = await this.repo.save(target);

    return {
      id: saved.id,
      username: user.username,
      review: saved.review,
      rating: saved.rating,
      playtime: saved.playtime,
      gameId: game.id,
      gameName: saved.gameName || game.name,
      backgroundImage: game.backgroundImage,
      createdAt: saved.createdAt,
    };
  }

  async getReviewsForGame(gameId: number) {
    const reviews = await this.repo.find({
      where: { game: { id: gameId }, review: Not('') },
      relations: ['user', 'game'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map(r => ({
      id: r.id,
      username: r.user?.username,
      review: r.review,
      rating: r.rating,
      playtime: r.playtime,
      gameId: r.game.id,
      gameName: r.gameName || r.game.name,
      backgroundImage: r.game.backgroundImage,
      createdAt: r.createdAt,
    }));
  }

  async getReviewsByUser(userId: number) {
    const reviews = await this.repo.find({
      where: { user: { id: userId }, review: Not('') },
      relations: ['user', 'game'],
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
      username: r.user?.username,
      createdAt: r.updatedAt,
    }));
  }

  async findByStatus(userId: number, status: GameStatus) {
    return this.repo.find({
      where: { user: { id: userId }, status },
      relations: ['game'],
    });
  }

  async findUserGameById(userId: number, gameId: number) {
    return this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
      relations: ['game'],
    });
  }
}
