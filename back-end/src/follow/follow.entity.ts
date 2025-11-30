// follow.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  follower: User; // El que sigue

  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  following: User; // El seguido
}
