import { Controller, Get, Param } from '@nestjs/common';
import { UserReviewsService } from './user-reviews.service';

@Controller('user-reviews')
export class UserReviewsController {
  constructor(private readonly userReviewsService: UserReviewsService) {}

  @Get(':userId')
  async getUserReviewsByUser(@Param('userId') userId: number) {
    return this.userReviewsService.getReviewsByUser(userId);
  }
}
