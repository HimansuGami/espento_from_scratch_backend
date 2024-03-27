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
    stake_apr: { type: Number, require: true },
    amount: { type: Number, require: true },
    total_expected_amount: { type: Number, require: true },
    total_claimed_amount: { type: Number, require: true, default: 0 },
    total_generated_amount: { type: Number, require: true, default: 0 },
    time_tenured: { type: Number, require: true },
    starting_date: { type: Date, required: true },
    per_second_apr: { type: Number, default: 0 },
    ending_date: { type: Date, required: true },
  },
  { timestamps: true },
);
StakeRewardLedgerSchema.plugin(require('mongoose-paginate'));
StakeRewardLedgerSchema.plugin(require('mongoose-delete'));
