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

  // En follow.service.ts (backend)
// En follow.service.ts (backend)
async getFollowers(userId: number) {
  const follows = await this.followRepo.find({
    where: { following: { id: userId } },
    relations: ['follower'],
  });
  
  // Usar la misma lógica que en UserController.mapUser()
  return follows.map(f => ({
    id: f.follower.id,
    username: f.follower.username,
    displayName: f.follower.displayName || '',
    email: f.follower.email || null,
    bio: f.follower.bio || '',
    profileImage: f.follower.profileImage, // Deja la URL como está (Cloudinary o null)
    followersCount: f.follower.followers?.length || 0,
    followingCount: f.follower.following?.length || 0,
  }));
}

async getFollowing(userId: number) {
  const follows = await this.followRepo.find({
    where: { follower: { id: userId } },
    relations: ['following'],
  });
  
  // Usar la misma lógica que en UserController.mapUser()
  return follows.map(f => ({
    id: f.following.id,
    username: f.following.username,
    displayName: f.following.displayName || '',
    email: f.following.email || null,
    bio: f.following.bio || '',
    profileImage: f.following.profileImage, // Deja la URL como está (Cloudinary o null)
    followersCount: f.following.followers?.length || 0,
    followingCount: f.following.following?.length || 0,
  }));
}


  async isFollowing(followerId: number, followingId: number) {
    const exists = await this.followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });
    return { following: !!exists };
  }
}
