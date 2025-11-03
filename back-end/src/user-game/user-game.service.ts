// src/user-game/user-game.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGame } from './user-game.entity';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(UserGame)
    private repo: Repository<UserGame>,
  ) {}

  async setStatus(userId: number, gameId: number, status: 'Playing' | 'Played' | 'Completed' | 'Abandoned') {
    let record = await this.repo.findOne({ where: { user: { id: userId }, game: { id: gameId } } });

    if (!record) {
      record = this.repo.create({
        user: { id: userId } as any,
        game: { id: gameId } as any,
        status,
      });
    } else {
      record.status = status;
    }

    return this.repo.save(record);
  }
}
