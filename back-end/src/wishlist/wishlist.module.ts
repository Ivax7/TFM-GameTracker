import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { WishlistController } from './wishlist.controller';
import { Wishlist } from './wishlist.entity';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User])],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistModule {}
