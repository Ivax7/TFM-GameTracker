// src/wishlist/wishlist.controller.ts
import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Post(':gameId')
  async addToWishlist(@Param('gameId') gameId: number, @Body() body: any, @Req() req) {
    const userId = req.user.id;

    const gameData = {
      id: gameId,
      name: body.gameName,
      background_image: body.backgroundImage
    };
    return this.wishlistService.addToWishlist(userId, gameData);
  }

  @Delete(':gameId')
  async removeFromWishlist(@Param('gameId') gameId: number, @Req() req) {
    const userId = req.user.id;
    return this.wishlistService.removeFromWishlist(userId, gameId);
  }

  @Get()
  async getWishlist(@Req() req) {
    const userId = req.user.id;
    return this.wishlistService.getWishlist(userId);
  }

  // AÑADE ESTE ENDPOINT QUE FALTA
  @Get('check/:gameId')
  async checkInWishlist(@Param('gameId') gameId: number, @Req() req) {
    const userId = req.user.id;
    return this.wishlistService.isInWishlist(userId, gameId);
  }
}
