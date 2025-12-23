import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { UserGame } from '../user-game/user-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame])],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
