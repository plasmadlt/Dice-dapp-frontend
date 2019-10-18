import { ActionAuthorization } from './action-authorization';


export interface Action<T> {

  account: string;

  name: 'bet' | 'dice';

  authorization: ActionAuthorization[];

  data: T;
}

export interface DiceActionData {
  // user account name
  user: string;
  // bet_id from executeBet
  bet_id: number;
  // Nobody knows how to calculate, will be described later
  seed: string;
}

export interface BetActionData {
  // User account name
  user: string;
  // Bet like "1.000000 EURP"
  quantity: string;
  // Some number from game interface 2 - 96
  roll_under: number;
  // Nobody knows how to calculate, will be described later
  seed_hash: string;
  // Nobody knows how to calculate, will be described later
  user_seed_hash: string;

  paySysCms: boolean;
}
