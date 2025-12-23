import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique } from "typeorm";
import { User } from "./user/user.entity";
import { CustomList } from "./custom-list.entity";


@Entity()
@Unique(['gameId', 'list'])

export class CustomListGame {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  backgroundImage?: string;

  @ManyToOne(() => CustomList, list => list.games, { onDelete: 'CASCADE' })
  list: CustomList;
}
