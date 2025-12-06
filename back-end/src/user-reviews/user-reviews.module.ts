import { Module } from '@nestjs/common';
import { UserReviewsService } from './user-reviews.service';
import { UserReviewsController } from './user-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from 'src/user-game/user-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame])],
  providers: [UserReviewsService],
  controllers: [UserReviewsController],
})
export class UserReviewsModule {}
