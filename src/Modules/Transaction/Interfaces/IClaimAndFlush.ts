import { Types } from 'mongoose';

export enum CLAIM_AND_FLUSH {
  claim = 'claim',
  flush = 'flush',
}

export class IClaimAndFlush {
  address: string;
  ehash: string;
  eventType: CLAIM_AND_FLUSH;
  amount: number;
  status: string;
  txn: Types.ObjectId;
}
