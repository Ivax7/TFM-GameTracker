// src/game/game.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserGame } from 'src/user-game/user-game.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  platform: string;

  @OneToMany(() => UserGame, (userGame) => userGame.game)
  userGames: UserGame[];
}
