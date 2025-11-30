import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepo.findOne({ where: { id: followerId } });
    const following = await this.userRepo.findOne({ where: { id: followingId } });

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    const exists = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (exists) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followRepo.create({ follower, following });
    return this.followRepo.save(follow);
  }

  async unfollowUser(followerId: number, followingId: number) {
    await this.followRepo.delete({
      follower: { id: followerId },
      following: { id: followingId },
    });
  }

  async getFollowers(userId: number) {
    return this.followRepo.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: number) {
    return this.followRepo.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
  }

  async isFollowing(followerId: number, followingId: number) {
    return !!(await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    }));
  }
}
