import { Schema } from 'mongoose';
import { Itransaction } from '../Interfaces/ITransaction';

export const TransactionSchema = new Schema<Itransaction>(
  {
    timeStamp: Number,
    ehash: { type: String, require: true, index: true, unique: true },
    transactionHash: { type: String, require: true, unique: true },
    from: { type: String, require: true, index: true },
    to: { type: String, require: true },
    data: String,
    blockNumber: Number,
    events: [
      {
        signature: String,
        topicId: String,
        name: { type: String, index: true },
        args: String,
      },
    ],
  },
  { timestamps: true },
);
TransactionSchema.plugin(require('mongoose-paginate'));
TransactionSchema.plugin(require('mongoose-delete'));
