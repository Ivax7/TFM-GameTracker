import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";
import { Game } from "../game/game.entity";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  score: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Game, { eager: true })
  game: Game;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
