export interface CustomList {
  id: number;
  title: string;
  description?: string;

  user: {
    id: number;
    username: string;
    displayName?: string;
  };

  createdAt?: string;
  games?: CustomListGame[];
}

export interface CustomListGame {
  gameId: number;
  name: string;
  backgroundImage?: string;
}
