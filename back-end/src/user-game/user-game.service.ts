import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ------------------------------------------
  // HELPERS
  // ------------------------------------------
  private async getUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async getGame(gameId: number, data?: Partial<Game>) {
    return this.gameService.findOrCreate({
      id: gameId,
      ...data,
    });
  }

  private async findUserGame(userId: number, gameId: number) {
    return this.repo.findOne({
      where: { user: { id: userId }, game: { id: gameId } },
      relations: ['user', 'game'],
    });
  }

  // ------------------------------------------
  // SET STATUS
  // ------------------------------------------
  async setStatus(
    userId: number,
    gameId: number,
    status: GameStatus,
    gameName?: string,
    backgroundImage?: string,
    released?: string,
    rating?: number,
  ) {
    const user = await this.getUser(userId);

    const game = await this.getGame(gameId, {
      name: gameName,
      backgroundImage,
      released,
      rating,
    });

    let userGame = await this.findUserGame(userId, game.id);

    if (!userGame) {
      userGame = this.repo.create({
        user: user as any,
        game: game as any,
        status,
        gameName: game.name ?? 'Unknown Game',
        backgroundImage: game.backgroundImage ?? undefined,
      });
    } else {
      userGame.status = status;
      userGame.gameName = game.name ?? userGame.gameName;
      userGame.backgroundImage = game.backgroundImage ?? userGame.backgroundImage;
    }

    return this.repo.save(userGame);
  }


  // ------------------------------------------
  // SET RATING
  // ------------------------------------------
  async setRating(userId: number, gameId: number, rating: number) {
    const user = await this.getUser(userId);
    const game = await this.getGame(gameId);

    let userGame = await this.findUserGame(userId, game.id);

    if (!userGame) {
      userGame = this.repo.create({
        user,
        game,
        status: 'Playing',
        gameName: game.name ?? 'Unknown Game',
        rating,
      });
    } else {
      userGame.rating = rating;
    }

    return this.repo.save(userGame);
  }

  // ------------------------------------------
  // SET PLAYTIME
  // ------------------------------------------
  async setPlaytime(userId: number, gameId: number, playtime: number) {
    const user = await this.getUser(userId);
    const game = await this.getGame(gameId);

    let userGame = await this.findUserGame(userId, game.id);

    if (!userGame) {
      userGame = this.repo.create({
        user,
        game,
        status: 'Playing',
        gameName: game.name ?? 'Unknown Game',
        playtime,
      });
    } else {
      userGame.playtime = playtime;
    }

    return this.repo.save(userGame);
  }

// ------------------------------------------
// SET REVIEW (SIN DUPLICADOS, guarda backgroundImage correctamente)
// ------------------------------------------

async setReview(
  userId: number,
  gameId: number,
  review: string,
  gameName?: string,
  backgroundImage?: string,
  released?: string,
  rating?: number,
) {
  if (!review?.trim()) throw new Error('Review cannot be empty');

  const user = await this.getUser(userId);

  // Recupera o crea el juego
  let game = await this.getGame(gameId, { name: gameName, backgroundImage, rating, released });

  // --- Actualiza Game si vienen nuevos datos ---
  let shouldSaveGame = false;

  if (backgroundImage && backgroundImage !== game.backgroundImage) {
    game.backgroundImage = backgroundImage;
    shouldSaveGame = true;
  }

  if (gameName && gameName !== game.name) {
    game.name = gameName;
    shouldSaveGame = true;
  }

  if (rating != null && rating !== game.rating) {
    game.rating = rating;
    shouldSaveGame = true;
  }

  if (released && released !== game.released) {
    game.released = released;
    shouldSaveGame = true;
  }

  if (shouldSaveGame) {
    await this.gameService.save(game); // Guarda la info completa en la tabla Game
  }

  // --- Crear o actualizar UserGame ---
  let userGame = await this.findUserGame(userId, game.id);

  if (!userGame) {
    userGame = this.repo.create({
      user: user as any,
      game: game as any,
      status: 'Playing',
      gameName: game.name ?? undefined,
      review,
      backgroundImage: game.backgroundImage ?? undefined,
      rating: game.rating ?? undefined,
      playtime: undefined,
    });
  } else {
    userGame.review = review;
    userGame.gameName = game.name ?? userGame.gameName;
    userGame.backgroundImage = game.backgroundImage ?? userGame.backgroundImage ?? undefined;
    userGame.rating = game.rating ?? userGame.rating ?? undefined;
  }

  const saved = await this.repo.save(userGame);

  return {
    id: saved.id,
    gameId: game.id,
    username: user.username,
    gameName: saved.gameName,
    review: saved.review,
    playtime: saved.playtime,
    rating: saved.rating,
    backgroundImage: saved.backgroundImage,
    createdAt: saved.createdAt,
  };
}


  // ------------------------------------------
  // GET REVIEWS FOR GAME
  // ------------------------------------------
// En user-game.service.ts (backend)
async getReviewsForGame(gameId: number) {
  const reviews = await this.repo.find({
    where: { game: { id: gameId }, review: Not('') },
    relations: ['user', 'game'],
    order: { createdAt: 'DESC' },
  });

  return reviews.map(r => ({
    id: r.id,
    userId: r.user?.id,
    username: r.user?.username,
    displayName: r.user?.displayName || r.user?.username,
    review: r.review,
    rating: r.rating,
    playtime: r.playtime,
    gameId: r.game.id,
    gameName: r.gameName ?? r.game.name,
    backgroundImage: r.game.backgroundImage,
    createdAt: r.createdAt,
    profileImage: r.user?.profileImage || null,
  }));
}


  // ------------------------------------------
  // GET USER REVIEWS
  // ------------------------------------------
  async getReviewsByUser(userId: number) {
    const reviews = await this.repo.find({
      where: { user: { id: userId }, review: Not('') },
      relations: ['user', 'game'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map(r => ({
      id: r.id,
      username: r.user.username,
      displayName: r.user.displayName || r.user.username,
      gameId: r.game.id,
      gameName: r.gameName ?? r.game.name,
      backgroundImage: r.game.backgroundImage,
      review: r.review,
      rating: r.rating,
      playtime: r.playtime,
      createdAt: r.updatedAt,
      // URL completa de Cloudinary o null
      profileImage: r.user.profileImage || null,
    }));
  }

  // ------------------------------------------
  // USED BY LISTS (PLAYING, COMPLETED…)
  // ------------------------------------------
  async findByStatus(userId: number, status: GameStatus) {
    return this.repo.find({
      where: { user: { id: userId }, status },
      relations: ['game'],
    });
  }

  async findUserGameById(userId: number, gameId: number) {
    return this.findUserGame(userId, gameId);
  }

  async getUserGamesByStatus(userId: number, status: string) {
    return this.repo.find({
      where: { user: { id: userId }, status },
      relations: ['game'],
      order: { updatedAt: 'DESC' }
    });
  }


}
