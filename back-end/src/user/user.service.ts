import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(email: string, password: string, username: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, username, password: hashed });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  // NUEVO: cargar relaciones followers y following
  async findByIdWithRelations(userId: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['followers', 'following'],
    });
  }

  async updateProfile(userId: number, data: Partial<User>) {
    await this.userRepo.update(userId, data);
    return this.findById(userId);
  }

  async deleteUser(userId: number) {
    const result = await this.userRepo.delete(userId);
    return (result.affected ?? 0) > 0;
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();

    return this.userRepo.createQueryBuilder('user')
      .where('LOWER(user.username) LIKE :q', { q: `%${lowerQuery}%` })
      .orWhere('LOWER(user.displayName) LIKE :q', { q: `%${lowerQuery}%` })
      .getMany();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { username },
      relations: ['followers', 'following'],
    });
  }
}
