import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { DESIGNATION, IUser } from '../Interfaces/Iuser';
import { IDirectRewardLedger } from '../Interfaces/IDirectRewardLedger';
export const DirectRewardLedgerSchema = new Schema<IDirectRewardLedger>(
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
    fromAddress: {
      type: String,
      required: true,
      lowercase: true,
      validate: [
        (value: string) => isAddress(value),
        'Address is not a valid address',
      ],
      index: true,
    },
    amount: { type: Number, default: 0 },
    tnxHash: { type: String, default: '' },
  },
  { timestamps: true },
);
DirectRewardLedgerSchema.plugin(require('mongoose-paginate'));
DirectRewardLedgerSchema.plugin(require('mongoose-delete'));
