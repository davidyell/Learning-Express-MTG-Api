export interface Player {
  id: number;
  first_name: string;
  last_name: string,
  email: string;
  created: Date;
}

export interface Deck {
  id: number;
  name: string;
  player_id: number;
  created: Date;
  updated: Date;
  player: Player;
}
