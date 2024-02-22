import { isAddress } from 'ethers';
import mongoose, { Schema } from 'mongoose';
import { ACHIEVEDVOLUME, DESIGNATION, IUser } from '../Interfaces/Iuser';
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
    isUserBlocked: { type: Boolean, default: false }, //added
    claimableAmountAfterUserBlocked: { type: Number, default: 0 }, //added
    currentuserLevel: { type: Number, default: 0 }, //added
    currentuserChildNumber: { type: Number, default: 0 }, //added
    parentuserLevel: { type: Number, default: 0 }, //added
    designation: { type: String, default: DESIGNATION.BRONZE },
    children: {
      //added
      type: [
        {
          address: { type: String },
          currentUserLevel: { type: Number },
          childrenNumber: { type: Number },
          parentAddress: { type: String },
        },
      ],
    },
    allParents: {
      type: [
        {
          address: { type: String },
          currentUserLevel: { type: Number },
          levelFromCurrentChild: { type: Number },
        },
      ],
    },
    parent: { type: Schema.Types.ObjectId, ref: 'users' },
    parentAddress: { type: String, index: true },
    refAddress: { type: String, index: true },
    newVolume: { type: Number, default: 0, min: 0 },
    nodeVolume: { type: Number, default: 0, min: 0 },

    levelIncome: {
      totalClaimed: { type: Number, default: 0, min: 0 },
      active: { type: Number, default: 0, min: 0 },
      activeLevels: { type: Number, default: 0, min: 0 },
      totalFlushed: { type: Number, default: 0, min: 0 },
      levelLogs: {
        type: [
          {
            //from: { type: String },
            //active: { type: Number, min: 0 },
            totalNodeVolume: { type: Number, min: 0 },
            fromLevel: { type: Number, min: 0 },
            //src: { type: String },
          },
        ],
        //default: [{ from: ZERO_ADDR, fromLevel: 1, active: 0, total: 0 }],
      },
      lastClaimedAt: { type: Schema.Types.Date, default: undefined },
      firstClaimedAt: { type: Schema.Types.Date, default: undefined },
    },
    directIncome: {
      active: { type: Number, default: 0, min: 0 },
      businessVolume: { type: Number, default: 0, min: 0 },
      totalClaimed: { type: Number, default: 0, min: 0 },
      lastClaimedAt: { type: Schema.Types.Date, default: undefined },
      activeMember: { type: Number, default: 0, min: 0 },
      totalMember: { type: Number, default: 0, min: 0 },
    },
    degignationIncome: {
      active: { type: Number, default: 0, min: 0 },
      totalClaimed: { type: Number, default: 0, min: 0 },
      lastClaimedAt: { type: Schema.Types.Date, default: undefined },
      achievedVolume: { type: Number, default: 0 },
    },
    capingLimit: {
      used: { type: Number, default: 0, min: 0 },
      limit: { type: Number, default: 0, min: 0 },
      remainingLimit: { type: Number, default: 0, min: 0 },
    },
    investments: {
      total: { type: Number, default: 0, min: 0 },
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
