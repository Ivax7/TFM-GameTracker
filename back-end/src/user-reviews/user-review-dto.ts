export class UserReviewDTO {
  id: number;
  userId: number;
  review: string;
  rating: number;
  playtime: number;
  createdAt: Date;

  game: {
    id: number | null;
    name: string;
    backgroundImage: string | null;
    rawg: any;
    hltb: any;
    platforms: any[];
    wishlist: boolean;
    status: string | null;
  };
}
