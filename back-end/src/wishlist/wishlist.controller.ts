import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  // Endpoints privados (requieren JWT)
  @Post(':gameId')
  @UseGuards(AuthGuard('jwt'))
  async addToWishlist(@Param('gameId') gameId: number, @Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const gameData = {
      id: gameId,
      name: body.gameName,
      background_image: body.backgroundImage,
    };
    return this.wishlistService.addToWishlist(userId, gameData);
  }

  @Delete(':gameId')
  @UseGuards(AuthGuard('jwt'))
  async removeFromWishlist(@Param('gameId') gameId: number, @Req() req) {
    const userId = req.user.userId;
    return this.wishlistService.removeFromWishlist(userId, gameId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getWishlist(@Req() req) {
    const userId = req.user.userId;
    return this.wishlistService.getWishlist(userId);
  }

  @Get('check/:gameId')
  @UseGuards(AuthGuard('jwt'))
  async checkInWishlist(@Param('gameId') gameId: number, @Req() req) {
    const userId = req.user.userId;
    return this.wishlistService.isInWishlist(userId, gameId);
  }

  // Endpoints públicos
  @Get('user/:userId')
  async getWishlistByUser(@Param('userId') userId: number) {
    return this.wishlistService.getWishlistByUser(userId);
  }
}
