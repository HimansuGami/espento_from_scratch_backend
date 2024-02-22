import { InjectModel } from '@nestjs/mongoose';
import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { ILevelRewardLedger } from 'src/Modules/User/Interfaces/ILevelRewardLedger';

export class LedgerService {
  constructor(
    @InjectModel('levelRewardLedger')
    private readonly LEVEL_REWARD_LEDGER: Model<ILevelRewardLedger & Document>,
  ) {}

  async createNew(
    address: string,
    fromAddress: string,
    amount: number,
    fromLevel: number,
  ) {
    try {
      const user = this.LEVEL_REWARD_LEDGER.create(
        { address: address },
        {
          $set: {
            fromAddress: fromAddress,
            amount: amount,
            fromLevel: fromLevel,
          },
        },
      );
      return user;
    } catch (error) {
      console.error('createNew from LEVEL_REWARD_LEDGER 16');
      console.error(error);
    }
  }

  async findOneAndUpdate(
    filter: FilterQuery<ILevelRewardLedger & Document<any, any, any>>,
    update: UpdateQuery<ILevelRewardLedger>,
    options?: QueryOptions & { rawResult: true; new: true },
  ) {
    try {
      const res = await this.LEVEL_REWARD_LEDGER.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return res;
    } catch (error) {
      console.error('findOneAndUpdate from USER_SERVICE 159');
      console.error(error);
    }
  }
}
