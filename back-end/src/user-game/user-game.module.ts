// src/user-game/user-game.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from './user-game.entity';
import { UserGameService } from './user-game.service';
import { UserGameController } from './user-game.controller';
import { GameModule } from 'src/game/game.module';
import { User } from './user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame, User]), GameModule],
  providers: [UserGameService],
  controllers: [UserGameController],
})
export class UserGameModule {}
