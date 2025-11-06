// src/game/game.service.ts
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
      // No existe → lo creamos
      game = this.repo.create({
        id: data.id,
        name: data.name || 'Unknown Game',
        backgroundImage: data.backgroundImage || null,
        released: data.released || null,
        rating: data.rating || null,
      });
    } else {
      // Existe → actualizamos si el nombre está vacío o es "Unknown Game"
      if (
        (!game.name || game.name === 'Unknown Game') &&
        data.name &&
        data.name !== 'Unknown Game'
      ) {
        game.name = data.name;
      }
      if (!game.backgroundImage && data.backgroundImage) {
        game.backgroundImage = data.backgroundImage;
      }
      if (!game.released && data.released) {
        game.released = data.released;
      }
      if (!game.rating && data.rating) {
        game.rating = data.rating;
      }
    }

    return await this.repo.save(game);
  }
}
