import { isAddress } from 'ethers';
import { Schema } from 'mongoose';
import { IMembers } from '../Interfaces/IMembers';

export const MembersLedgerSchema = new Schema<IMembers>(
  {
    parentAddress: {
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
    fromAddress: { type: String, require: true, index: true },
    childNumber: { type: Number, require: true },
    atLevel: { type: Number, required: true },
    //type: { type: String, require: true },
  },
  { timestamps: true },
);
MembersLedgerSchema.plugin(require('mongoose-paginate'));
MembersLedgerSchema.plugin(require('mongoose-delete'));
