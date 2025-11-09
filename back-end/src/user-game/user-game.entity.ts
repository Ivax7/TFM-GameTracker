import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';

@Entity()
@Unique(['user', 'game'])
export class UserGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userGames, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Game, (game) => game.userGames, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column('varchar', { nullable: true })
  gameName: string;

  @Column()
  status: string;

  @Column({ type: 'float', nullable: true })
  rating?: number;
}
