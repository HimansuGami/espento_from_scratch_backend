export class IRewards {
  address: string;
  ehash: string;
  transactionHash: string;
  rewardType: REWARD_TYPE;
  fromAddress: string;
  rewardAmount: number;
  fromLevel: number;
  eventType: DIST_INCOME_ON_EVENTS_TYPE;
  actionAmount: number;
}
export enum REWARD_TYPE {
  direct = 'direct',
  level = 'level',
}
export const DIST_INCOME_ON_EVENTS = {
  liquidityAdded: 'liquidityAdded',
  spentStake: 'spentStake',
  spentCollateral: 'spentCollateral',
  ZapIn: 'ZapIn',
} as const;
export type DIST_INCOME_ON_EVENTS_TYPE =
  (typeof DIST_INCOME_ON_EVENTS)[keyof typeof DIST_INCOME_ON_EVENTS];
