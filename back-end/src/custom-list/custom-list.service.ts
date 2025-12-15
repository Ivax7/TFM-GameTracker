import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomList } from './custom-list.entity';
import { CustomListGame } from './custom-list-game.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CustomListsService {

  constructor(
    @InjectRepository(CustomList)
    private listRepo: Repository<CustomList>,

    @InjectRepository(CustomListGame)
    private gameRepo: Repository<CustomListGame>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getByUser(userId: number) {
    return this.listRepo.find({
      where: { user: { id: userId } },
      relations: ['games']
    });
  }

  async create(userId: number, data: { title: string; description?: string }) {
  
    const user = await this.userRepo.findOneBy({ id: userId });
  
    if (!user) {
      throw new ForbiddenException('User not found');
    }
  
    const list = this.listRepo.create({
      title: data.title,
      description: data.description,
      user
    });
  
    return this.listRepo.save(list);
  }


  async addGame(userId: number, listId: number, game: any) {
    const list = await this.listRepo.findOne({
      where: { id: listId, user: { id: userId } }
    });

    if (!list) throw new ForbiddenException();

    const entry = this.gameRepo.create({
      gameId: game.id,
      name: game.name,
      backgroundImage: game.background_image,
      list
    });

    return this.gameRepo.save(entry);
  }
}
