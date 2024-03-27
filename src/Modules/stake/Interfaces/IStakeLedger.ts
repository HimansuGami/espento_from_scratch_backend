import { LargeNumberLike } from 'crypto';
import { Types } from 'mongoose';

export enum STAKE_TYPE {
  LP_USDT = 'LP_USDT',
  USDT_SPENT = 'USDT_SPENT',
}
export enum STAKE_APR {
  FIFTY = 50,
  HUNDRED = 100,
  ONE_HUNDRED_FIFTY = 150,
}

export class IStakeLedger {
  user_address: string;
  txn_hash: string;
  stake_type: STAKE_TYPE;
  stake_apr: STAKE_APR;
  amount: number;
  starting_date: Date;
  ending_date: Date;
  time_tenure: number;
}
