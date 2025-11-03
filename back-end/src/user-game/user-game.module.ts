// src/user-game/user-game.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from './user-game.entity';
import { UserGameService } from './user-game.service';
import { UserGameController } from './user-game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame])],
  providers: [UserGameService],
  controllers: [UserGameController],
})
export class UserGameModule {}
