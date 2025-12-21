import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('suggestions')
export class Suggestions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  suggestion: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ type: 'timestamp' })
  date: Date;
}
