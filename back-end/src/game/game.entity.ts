// src/game/game.entity.ts
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { UserGame } from '../user-game/user-game.entity';

@Entity()
export class Game {
  @PrimaryColumn()
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  backgroundImage: string | null;

  @Column('varchar', { nullable: true })
  released: string | null;

  @Column('float', { nullable: true })
  rating: number | null;

  @OneToMany(() => UserGame, (userGame) => userGame.game)
  userGames: UserGame[];
}
