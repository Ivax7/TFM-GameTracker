import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist) private wishlistRepo: Repository<Wishlist>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Añadir juego a la wishlist
  async addToWishlist(userId: number, gameData: any) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Verificar si el juego ya está en la wishlist del usuario
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, gameId: gameData.id },
    });
    if (existing) return existing;

    const item = this.wishlistRepo.create({
      user,  // TypeORM asigna userId automáticamente
      gameId: gameData.id,
      gameName: gameData.name,
      backgroundImage: gameData.background_image,
    });

    return this.wishlistRepo.save(item);
  }

  // Quitar juego de la wishlist
  async removeFromWishlist(userId: number, gameId: number) {
    const result = await this.wishlistRepo.delete({
      user: { id: userId },
      gameId,
    });

    if (result.affected === 0)
      throw new NotFoundException('Game not found in wishlist');

    return { success: true };
  }

  // Obtener wishlist privada
  async getWishlist(userId: number) {
    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  // Verificar si un juego está en la wishlist
  async isInWishlist(userId: number, gameId: number): Promise<boolean> {
    const item = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, gameId },
    });
    return !!item;
  }

  // Obtener wishlist pública de otro usuario
  async getWishlistByUser(userId: number) {
    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }
}
