import { Document, Types } from 'mongoose';
export class LevelLogsDto {
  //from: string;
  //active: number;
  totalNodeVolume: number;
  fromLevel: number;
  //src: DIST_INCOME_ON_EVENTS_TYPE;
}

export class ChildrenDto {
  address: string;
  childrenNumber: number;
  parentAddress: string;
  currentUserLevel: number;
  childLevelFromParent: number;
  calculatedDegignationVolume: number;
  carryForwardDegignationVolume: number;
}

export enum DESIGNATION {
  SILVER = 'silver',
  GOLD = 'gold',
  BRONZE = 'bronze',
}
export enum ACHIEVEDVOLUME {
  SILVER = 25000,
  GOLD = 50000,
  BRONZE = 10000,
}

export class AllParentsDto {
  address: string;
  currentUserLevel: number;
  levelFromCurrentChild: number;
}
export class IUser {
  address: string;
  isMemeber: boolean;
  ref: Types.ObjectId;
  refAddress: string;
  isUserBlocked: boolean; //added
  claimableAmountAfterUserBlocked: number; //added
  currentuserLevel: number; //added
  currentuserChildNumber: number = 0; //added
  parentuserLevel: number; //added
  children: ChildrenDto[]; //added
  allParents: AllParentsDto[]; //added
  parent: Types.ObjectId;
  parentAddress: string;
  approvedClaimAmount: number;
  designation: DESIGNATION;
  nodeVolume: number;
  newVolume: number;
  businessVolum: number;
  levelIncome: {
    active: number;
    activeLevels: number;
    totalClaimed: number;
    totalFlushed: number;
    levelLogs: LevelLogsDto[];
    lastClaimedAt: typeof Date | undefined;
  };
  degignationIncome: {
    active: number;
    totalClaimed: number;
    lastClaimedAt: typeof Date | undefined;
    achievedVolume: number;
  };
  directIncome: {
    totalMember: any;
    active: number;
    businessVolume: number;
    totalClaimed: number;
    lastClaimedAt: typeof Date | undefined;
    activeMember: number;
  };
  capingLimit: {
    used: number;
    limit: number;
    remainingLimit: number;
  };
  investments: {
    total: number;
    lastInvestedAt: string;
    lastInvestedAmount: number;
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
