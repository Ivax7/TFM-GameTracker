import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly repo: Repository<Game>,
  ) {}

  async findOrCreate(data: Partial<Game>): Promise<Game> {
    if (!data.id) throw new Error('Game ID is required');

    let game = await this.repo.findOne({ where: { id: data.id } });

    if (!game) {
      const newGame = this.repo.create({
        id: data.id,
        name: data.name || 'Unknown Game',
        backgroundImage: data.backgroundImage || null,
        released: data.released || null,
        rating: data.rating ?? null,
      });
      return await this.repo.save(newGame);
    }

    const updatedFields: Partial<Game> = {};

    if (
      (!game.name || game.name === 'Unknown Game') &&
      data.name &&
      data.name !== 'Unknown Game'
    ) {
      updatedFields.name = data.name;
    }

    if (!game.backgroundImage && data.backgroundImage) {
      updatedFields.backgroundImage = data.backgroundImage;
    }

    if (!game.released && data.released) {
      updatedFields.released = data.released;
    }

    if (!game.rating && data.rating) {
      updatedFields.rating = data.rating;
    }

    if (Object.keys(updatedFields).length === 0) {
      return game;
    }

    await this.repo.update(game.id, updatedFields);

    const updatedGame = await this.repo.findOne({ where: { id: game.id } });
    if (!updatedGame) throw new Error('Game not found after update');
    return updatedGame;
  }
}
