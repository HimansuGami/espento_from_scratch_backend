import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { IStakeRewardLedger } from '../Interfaces/IStakeRewardLedger';

export const StakeRewardLedgerSchema = new Schema<IStakeRewardLedger>(
  {
    user_address: {
      type: String,
      required: true,
      lowercase: true,
      validate: [
        (value: string) => isAddress(value),
        'Address is not a valid address',
      ],
      index: true,
    },
    stake_type: { type: String, require: true },
    hash: { type: String, require: true },
    stake_apr: { type: Number, require: true },
    amount: { type: Number, require: true },
  },
  { timestamps: true },
);
StakeRewardLedgerSchema.plugin(require('mongoose-paginate'));
StakeRewardLedgerSchema.plugin(require('mongoose-delete'));
