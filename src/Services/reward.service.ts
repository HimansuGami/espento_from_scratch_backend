import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/Modules/User/user.service';
import {
  BLOCKS_PER_DAY,
  FARM_APR,
  FARM_TENURE,
} from 'src/Shared/Constants/shared.constant';

export class RewardService {
  constructor(private readonly _userService: UserService) {}
  async getLevelRewardPerBlock(level: number, amount: number, address: string) {
    const levelRewards = [
      15, 10, 7, 7, 7, 7, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3,
    ];
    const levelRewardPercentage =
      level <= levelRewards.length ? levelRewards[level - 1] : 0;

    const totalPercentage = FARM_TENURE * FARM_APR;

    const totalDistributaedAmount = amount * (totalPercentage / 100);

    const totalReceievableAmount =
      totalDistributaedAmount * (levelRewardPercentage / 100);

    const perDayReceivableReward = totalReceievableAmount / (FARM_TENURE * 365);

    const levelRewardPerBlock = perDayReceivableReward / BLOCKS_PER_DAY;
    await this._userService.findOneAndUpdate(
      { address: new RegExp(address, 'i') },
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
  }

  async getDirectRewardPercentage(level, amount, address) {
    const directRewardPercentage = level === 1 ? 5 : 0; // 5% direct reward if there are direct children, otherwise 0

    let directReward = 0;
    if (level === 1) {
      directReward = amount * (directRewardPercentage / 100);
    }
    await this._userService.findOneAndUpdate(
      { address: new RegExp(address, 'i') },
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
  }
}
