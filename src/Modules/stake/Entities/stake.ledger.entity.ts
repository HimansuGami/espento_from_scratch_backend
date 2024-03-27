import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { IStakeLedger } from '../Interfaces/IStakeLedger';

export const StakeLedgerSchema = new Schema<IStakeLedger>(
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
    total_expected_amount: { type: Number, require: true },
    total_claimed_amount: { type: Number, require: true, default: 0 },
    total_remaining_amount: { type: Number, require: true, default: 0 },
    time_tenured: { type: Number, require: true },
    starting_date: { type: Date, required: true },
    per_second_apr: { type: Number, default: 0 },
    ending_date: { type: Date, required: true },
    last_claimed_at: { type: Date },
  },
  { timestamps: true },
);
StakeLedgerSchema.plugin(require('mongoose-paginate'));
StakeLedgerSchema.plugin(require('mongoose-delete'));
