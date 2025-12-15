import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomList } from './custom-list.entity';
import { CustomListGame } from './custom-list-game.entity';
import { CustomListsService } from './custom-list.service';
import { CustomListController } from './custom-list.controller';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomList, CustomListGame, User])
  ],
  providers: [CustomListsService],
  controllers: [CustomListController]
})
export class CustomListModule {}
