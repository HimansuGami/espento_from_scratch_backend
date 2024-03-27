import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { IStakeLedger, STAKE_TYPE } from '../Interfaces/IStakeLedger';

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
    txn_hash: { type: String, default: '0x' },
    stake_type: { type: String, require: true, index: true },
    stake_apr: { type: Number, require: true, index: true },
    amount: { type: Number, required: true },
    starting_date: { type: Date, required: true },
    ending_date: { type: Date, required: true },
    time_tenure: { type: Number, required: true },
  },
  { timestamps: true },
);
StakeLedgerSchema.plugin(require('mongoose-paginate'));
StakeLedgerSchema.plugin(require('mongoose-delete'));
