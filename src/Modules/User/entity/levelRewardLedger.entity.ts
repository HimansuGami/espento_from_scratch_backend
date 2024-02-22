import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { DESIGNATION, IUser } from '../Interfaces/Iuser';
import { ILevelRewardLedger } from '../Interfaces/ILevelRewardLedger';
export const LevelRewardLedgerSchema = new Schema<ILevelRewardLedger>(
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
    fromLevel: { type: Number, default: 0 },
  },
  { timestamps: true },
);
LevelRewardLedgerSchema.plugin(require('mongoose-paginate'));
LevelRewardLedgerSchema.plugin(require('mongoose-delete'));
