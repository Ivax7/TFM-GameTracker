import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    UserService, 
    CloudinaryService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}