import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { IUser } from 'src/Modules/User/Interfaces/Iuser';
import { UserService } from 'src/Modules/User/user.service';
import {
  BLOCKS_PER_DAY,
  FARM_APR,
  FARM_TENURE,
} from 'src/Shared/Constants/shared.constant';
import { LedgerService } from 'src/Shared/Services/ledger.service';

export class RewardService {
  constructor(
    @InjectModel('users')
    private readonly USER_DB: Model<IUser & Document>,
    private readonly _userService: UserService,
    private readonly _ledgerService: LedgerService,
  ) {}
  async getLevelRewardPerBlock(
    amount: number,
    fromLevel: number,
    fromAddress: string,
    toAddress: string,
  ) {
    const levelRewards = [
      15, 10, 7, 7, 7, 7, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3,
    ];
    const levelRewardPercentage =
      fromLevel <= levelRewards.length ? levelRewards[fromLevel - 1] : 0;
    console.log({ levelRewardPercentage });

    const totalPercentage = FARM_TENURE * FARM_APR;
    const totalDistributaedAmount = amount * (totalPercentage / 100);
    const totalReceievableAmount =
      totalDistributaedAmount * (levelRewardPercentage / 100);
    const perDayReceivableReward = totalReceievableAmount / (FARM_TENURE * 365);
    const levelRewardPerBlock = perDayReceivableReward / BLOCKS_PER_DAY;
    console.log({ levelRewardPerBlock });

    await this.USER_DB.findOneAndUpdate(
      { address: new RegExp(toAddress, 'i') },
      {
        $inc: {
          'levelIncome.active': levelRewardPerBlock,
          'capingLimit.remainingLimit': -levelRewardPerBlock,
          'capingLimit.used': +levelRewardPerBlock,
        },
      },
      {
        new: true,
        rawResult: true,
      },
    );

    //entry in levelRewardLedger
    await this._ledgerService.createLevelLedger(
      amount,
      fromLevel,
      fromAddress,
      toAddress,
    );
  }

  async getDirectRewardPercentage(amount, fromLevel, fromAddress, toAddress) {
    const directRewardPercentage = fromLevel === 1 ? 5 : 0; // 5% direct reward if there are direct children, otherwise 0

    let directReward = 0;
    if (fromLevel === 1) {
      directReward = amount * (directRewardPercentage / 100);
      await this._userService.findOneAndUpdate(
        { address: new RegExp(toAddress, 'i') },
        {
          $inc: {
            'directIncome.active': directReward,
          },
        },
        {
          new: true,
          rawResult: true,
        },
      );
      //need to create direct reward ledger
      await this._ledgerService.createDirectLedger(
        amount,
        fromAddress,
        toAddress,
      );
    }
  }
}
