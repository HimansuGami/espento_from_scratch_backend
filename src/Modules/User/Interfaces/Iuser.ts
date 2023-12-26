import { Document, Types } from 'mongoose';
export class LevelLogsDto {
  from: string;
  active: number;
  total: number;
  fromLevel: number;
  src: DIST_INCOME_ON_EVENTS_TYPE;
}
export class IUser {
  address: string;
  isMemeber: boolean;
  ref: Types.ObjectId;
  refAddress: string;
  childNumber: number; //added
  parentLevel: number; //added
  currentUserLevel: number; //added
  isUserBlocked: boolean; //added
  claimableAmountAfterUserBlocked: number; //added
  parent: Types.ObjectId;
  parentAddress: string;
  approvedClaimAmount: number;
  /************************************** */
  /**************NETWORK_DATA************ */
  /************************************** */
  nodeVolume: {
    total: number;
    liquidityAdded: number;
    spentStake: number;
    spentCollateral: number;
  };
  levelIncome: {
    totalClaimed: number;
    totalFlushed: number;
    carryForward: number;
    liquidityAdded: number;
    spentStake: number;
    spentCollateral: number;
    levelLogs: LevelLogsDto[];
    lastClaimedAt: typeof Date | undefined;
  };
  directIncome: {
    active: number;
    totalClaimed: number;
    liquidityAdded: number;
    spentStake: number;
    spentCollateral: number;
    lastClaimedAt: typeof Date | undefined;
  };
  capingLimit: {
    used: number;
    limit: number;
    remainingLimit: number;
    src: DIST_INCOME_ON_EVENTS_TYPE | string;
  };
  investments: {
    total: number;
    liquidityAdded: number;
    spentStake: number;
    spentCollateral: number;
    limitUpdatedInvestmentAt: string;
    lastInvestedAt: string;
    lastAmount: number;
    src: string;
  };
  /************************************** */
  // CLAIM DATA
  lastClaimedAt: typeof Date | undefined;
  firstClaimedAt: typeof Date | undefined;
  lastFlushedAt: typeof Date | undefined;
  // firstRewardAt: typeof Date | undefined;
  firstClaimInLast24At: typeof Date | undefined;
}
export const DIST_INCOME_ON_EVENTS = {
  liquidityAdded: 'liquidityAdded',
  spentStake: 'spentStake',
  spentCollateral: 'spentCollateral',
  //ZapIn: 'ZapIn',
} as const;
export type DIST_INCOME_ON_EVENTS_TYPE =
  (typeof DIST_INCOME_ON_EVENTS)[keyof typeof DIST_INCOME_ON_EVENTS];

export interface ALL_BLOCKLISTED_USERS_ADDRESS {
  blockedUsersAddresses: string[];
  count: number;
}
