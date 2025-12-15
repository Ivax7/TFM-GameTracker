export interface CustomList {
  id: number;
  title: string;
  description?: string;
  userId: number;

  games?: CustomListGame[];
}

export interface CustomListGame {
  gameId: number;
  name: string;
  background_image?: string;
}
