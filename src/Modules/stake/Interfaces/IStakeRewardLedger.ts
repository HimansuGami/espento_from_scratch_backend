import { Types } from 'mongoose';

export enum STAKE_TYPE {
  LP_USDT = 'LP_USDT',
  SPENT_USDT = 'SPENT_USDT',
}
export enum STAKE_APR {
  FIFTY = 50,
  HUNDRED = 100,
  ONE_HUNDRED_FIFTY = 150,
}

export class IStakeRewardLedger {
  user_address: string;
  stake_type: STAKE_TYPE;
  stake_apr: STAKE_APR;
  amount: number;
  total_receivable_amount: number;
  total_claimed_amount: number;
  time_tenured: number;
  total_generated_amount: number;
  starting_date: Date;
  ending_date: Date;
}
