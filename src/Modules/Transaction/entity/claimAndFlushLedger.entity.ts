import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { IClaimAndFlush } from '../Interfaces/IClaimAndFlush';

export const ClaimAndFlushLedgerSchema = new Schema<IClaimAndFlush>(
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
    txn: { type: Schema.Types.ObjectId, ref: 'transactions' },
    ehash: { type: String, require: true, index: true },
    eventType: { type: String, require: true, index: true },
    amount: { type: Number, required: true },
    status: { type: String, require: true, index: true, default: 'completed' },
  },
  { timestamps: true },
);
ClaimAndFlushLedgerSchema.plugin(require('mongoose-paginate'));
ClaimAndFlushLedgerSchema.plugin(require('mongoose-delete'));
