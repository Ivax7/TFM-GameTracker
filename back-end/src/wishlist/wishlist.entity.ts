// src/wishlist/wishlist.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number; // ID del juego (por ejemplo, el de RAWG)

  @Column()
  gameName: string;

  @Column({ nullable: true })
  backgroundImage: string;

  @ManyToOne(() => User, user => user.wishlist, { onDelete: 'CASCADE' })
  user: User;
}
