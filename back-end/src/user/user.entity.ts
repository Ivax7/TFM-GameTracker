import { Wishlist } from 'src/wishlist/wishlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserGame } from 'src/user-game/user-game.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;
  
  @Column()
  password: string;
  
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];
  
  @OneToMany(() => UserGame, (userGame) => userGame.user)
  userGames: UserGame[];
  
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @Column({ default: '' })
  displayName: string;

  @Column({ default: '' })
  bio: string;
}
