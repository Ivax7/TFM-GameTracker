import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Game } from 'src/game/game.entity';

@Entity()
export class UserGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userGames)
  user: User;

  @ManyToOne(() => Game, (game) => game.userGames)
  game: Game;

  @Column({
    type: 'enum',
    enum: ['Playing', 'Played', 'Completed', 'Abandoned'],
  })
  status: 'Playing' | 'Played' | 'Completed' | 'Abandoned';
}
