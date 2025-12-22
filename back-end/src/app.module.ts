// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { WishlistModule } from './wishlist/wishlist.module';
// import { UserGameModule } from './user-game/user-game.module';
// import { User } from './user/user.entity';
// import { Game } from './game/game.entity';
// import { UserGame } from './user-game/user-game.entity';
// import { Wishlist } from './wishlist/wishlist.entity';
// import { GameModule } from './game/game.module';
// import { FollowModule } from './follow/follow.module';
// import { RatingModule } from './rating/rating.module';
// import { UserReviewsModule } from './user-reviews/user-reviews.module';
// import { CustomListModule } from './custom-list/custom-list.module';
// import { SuggestionsModule } from './suggestions/suggestions.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5433,
//       username: 'postgres',
//       password: 'root',
//       database: 'TFM-GT',
//       autoLoadEntities: true,
//       entities: [User, Game, UserGame, Wishlist],
//       synchronize: true,
//     }),
//     UserModule,
//     AuthModule,
//     WishlistModule,
//     UserGameModule,
//     GameModule,
//     FollowModule,
//     RatingModule,
//     UserReviewsModule,
//     CustomListModule,
//     SuggestionsModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { UserGameModule } from './user-game/user-game.module';
import { GameModule } from './game/game.module';
import { FollowModule } from './follow/follow.module';
import { RatingModule } from './rating/rating.module';
import { UserReviewsModule } from './user-reviews/user-reviews.module';
import { CustomListModule } from './custom-list/custom-list.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',

      // Render / producción
      url: process.env.DATABASE_URL,

      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,

      autoLoadEntities: true,

      // SOLO para desarrollo
      // synchronize: true,
    }),

    UserModule,
    AuthModule,
    WishlistModule,
    UserGameModule,
    GameModule,
    FollowModule,
    RatingModule,
    UserReviewsModule,
    CustomListModule,
    SuggestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
