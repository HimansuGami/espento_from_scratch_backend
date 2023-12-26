import { isAddress } from 'ethers';
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../Interfaces/Iuser';
import { ZERO_ADDR } from 'src/Shared/Constants/shared.constant';
export const UserSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      required: true,
      lowercase: true,
      validate: [
        (value: string) => isAddress(value),
        'Address is not a valid address',
      ],
      index: true,
    },
    isMemeber: { type: Boolean, default: false },
    ref: { type: Schema.Types.ObjectId, ref: 'users' },
    childNumber: { type: Number, required: true, default: 0 }, //added
    parentLevel: { type: Number, default: 0 }, //added.
    currentUserLevel: { type: Number, default: 0 }, //added
    isUserBlocked: { type: Boolean, default: false }, //added
    claimableAmountAfterUserBlocked: { type: Number, default: 0 }, //added
    parent: { type: Schema.Types.ObjectId, ref: 'users' },
    parentAddress: { type: String, index: true },
    refAddress: { type: String, index: true },
    /************************************** */
    /**************NETWORK_DATA************ */
    /************************************** */
    approvedClaimAmount: { type: Number, default: 0, min: 0 },
    nodeVolume: {
      total: { type: Number, default: 0, min: 0 }, // total node volume
      liquidityAdded: { type: Number, default: 0, min: 0 }, //show last liquidity added
      spentStake: { type: Number, default: 0, min: 0 },
      spentCollateral: { type: Number, default: 0, min: 0 },
    },
    levelIncome: {
      totalClaimed: { type: Number, default: 0, min: 0 },
      totalFlushed: { type: Number, default: 0, min: 0 },
      liquidityAdded: { type: Number, default: 0, min: 0 },
      spentStake: { type: Number, default: 0, min: 0 },
      spentCollateral: { type: Number, default: 0, min: 0 },
      levelLogs: {
        type: [
          {
            from: { type: String },
            active: { type: Number, min: 0 },
            total: { type: Number, min: 0 },
            fromLevel: { type: Number, min: 0 },
            src: { type: String },
          },
        ],
        default: [
          { from: ZERO_ADDR, fromLevel: 1, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 2, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 3, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 4, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 5, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 6, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 7, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 8, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 9, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 10, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 11, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 12, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 13, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 14, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 15, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 16, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 17, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 18, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 19, active: 0, total: 0 },
          { from: ZERO_ADDR, fromLevel: 20, active: 0, total: 0 },
        ],
      },
      lastClaimedAt: { type: Schema.Types.Date, default: undefined },
      firstClaimedAt: { type: Schema.Types.Date, default: undefined },
    },
    directIncome: {
      active: { type: Number, default: 0, min: 0 },
      totalClaimed: { type: Number, default: 0, min: 0 },
      liquidityAdded: { type: Number, default: 0, min: 0 },
      spentStake: { type: Number, default: 0, min: 0 },
      spentCollateral: { type: Number, default: 0, min: 0 },
      lastClaimedAt: { type: Schema.Types.Date, default: undefined },
    },
    capingLimit: {
      used: { type: Number, default: 0, min: 0 },
      limit: { type: Number, default: 0, min: 0 },
      remainingLimit: { type: Number, default: 0, min: 0 },
      src: { type: String },
    },
    investments: {
      total: { type: Number, default: 0, min: 0 },
      lastAmount: { type: Number, min: 0 },
      liquidityAdded: { type: Number, default: 0, min: 0 },
      spentStake: { type: Number, default: 0, min: 0 },
      spentCollateral: { type: Number, default: 0, min: 0 },
      lastInvestedAt: { type: Schema.Types.Date, default: undefined },
      limitUpdatedInvestmentAt: { type: Schema.Types.Date, default: undefined },
      src: { type: String },
    },
    lastClaimedAt: { type: Schema.Types.Date, default: undefined },
    lastFlushedAt: { type: Schema.Types.Date, default: undefined },
    // firstRewardAt: { type: Schema.Types.Date, default: undefined },
    firstClaimInLast24At: { type: Schema.Types.Date, default: undefined },
  },
  { timestamps: true },
);
UserSchema.plugin(require('mongoose-paginate'));
UserSchema.plugin(require('mongoose-delete'));
