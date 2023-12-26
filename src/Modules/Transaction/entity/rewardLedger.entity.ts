import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { IRewards } from '../Interfaces/IRward';

export const RewardsLedgerSchema = new Schema<IRewards>(
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
    ehash: { type: String, require: true, index: true },
    rewardType: { type: String, require: true, index: true },
    fromAddress: { type: String, require: true, index: true },
    rewardAmount: { type: Number, required: true },
    fromLevel: { type: Number, required: true },
    eventType: { type: String, require: true, index: true },
    actionAmount: { type: Number, required: true },
    transactionHash: { type: String, require: true, index: true },
  },
  { timestamps: true },
);
RewardsLedgerSchema.plugin(require('mongoose-paginate'));
RewardsLedgerSchema.plugin(require('mongoose-delete'));
