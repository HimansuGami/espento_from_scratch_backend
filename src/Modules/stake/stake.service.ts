import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStakeLedger } from './Interfaces/IStakeLedger';
import { IStakeRewardLedger } from './Interfaces/IStakeRewardLedger';
import { Cron } from '@nestjs/schedule';

interface IUpdatedStakeRecordLog {
  user_address: string;
  total_receivable_amount: number;
  total_claimed_amount: number;
  total_generated_amount: number;
  stake_type: string;
  stake_apr: number;
}

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('stakeledger')
    private readonly STAKE_LEDGER: Model<IStakeLedger & Document>,
    @InjectModel('stakerewardledger')
    private readonly STAKE_REWARD_LEDGER: Model<IStakeRewardLedger & Document>,
  ) {}

  async addStakeAsync(
    amount,
    user_address,
    stake_apr,
    stake_type,
    time_tenure,
  ) {
    await this.STAKE_LEDGER.create({
      user_address: user_address,
      stake_apr: stake_apr,
      stake_type: stake_type,
      txn_hash: user_address,
      amount: amount,
      starting_date: new Date(),
      ending_date: this.stakeCompletionDate(time_tenure),
      time_tenure: time_tenure,
    });

    const prevStakeRecord = await this.STAKE_REWARD_LEDGER.findOne({
      user_address: new RegExp(user_address, 'i'),
      stake_type: stake_type,
      stake_apr: stake_apr,
      time_tenured: time_tenure,
    });

    if (prevStakeRecord) {
      const data = await this.STAKE_REWARD_LEDGER.findOneAndUpdate(
        {
          user_address: new RegExp(user_address, 'i'),
          stake_type: stake_type,
          stake_apr: stake_apr,
          time_tenured: time_tenure,
        },
        {
          $set: {
            user_address: user_address,
            stake_apr: stake_apr,
            stake_type: stake_type,
            txn_hash: user_address,
            time_tenured: time_tenure,
            total_receivable_amount:
              this.getRemainingRewardAmount(
                prevStakeRecord.total_receivable_amount,
                prevStakeRecord.total_generated_amount,
              ) + this.calculateRewardAmount(amount, stake_apr),
            starting_date: new Date(),
            ending_date: this.stakeCompletionDate(time_tenure),
          },
          $push: {
            amount: amount,
          },
        },
        {
          new: true,
          rawResult: true,
        },
      );
      let updatedStakeRecordLog: IUpdatedStakeRecordLog = {
        user_address: user_address,
        total_receivable_amount: data.total_receivable_amount,
        total_claimed_amount: data.total_claimed_amount,
        total_generated_amount: data.total_generated_amount,
        stake_type: stake_type,
        stake_apr: stake_apr,
      };
      console.log({ updatedStakeRecordLog });
    } else {
      await this.STAKE_REWARD_LEDGER.create({
        user_address: user_address,
        stake_apr: stake_apr,
        stake_type: stake_type,
        time_tenured: time_tenure,
        amount: [amount],
        total_receivable_amount: this.calculateRewardAmount(amount, stake_apr),
        total_claimed_amount: 0,
        starting_date: new Date(),
        ending_date: this.stakeCompletionDate(time_tenure),
      });
    }

    return null;
  }

  calculateRewardAmount(amount: number, stake_apr: number): number {
    const total_receivable_amount = amount + (amount * stake_apr) / 100;
    return total_receivable_amount;
  }

  getRemainingRewardAmount(
    total_receivable_amount: number,
    total_generated_amount: number,
  ): number {
    return total_receivable_amount - total_generated_amount;
  }

  @Cron('*/1 * * * * *')
  async calculateRewardEverySecond(stake_type: string) {
    const user = await this.STAKE_REWARD_LEDGER.findOne({
      user_address: new RegExp(
        '0x1b141f32e97be464a9fbf4075a352c944b5b51d9',
        'i',
      ),
      stake_type: 'LP-USDT',
    });
    // console.log({ user });

    if (user) {
      const amountPerSecond =
        user.total_receivable_amount / (user.time_tenured * 365 * 86400);
      console.log({
        user: '0x1b141f32e97be464a9fbf4075a352c944b5b51d9',
        amountPerSecond,
      });

      const data = await this.STAKE_REWARD_LEDGER.findOneAndUpdate(
        {
          user_address: new RegExp(
            '0x1b141f32e97be464a9fbf4075a352c944b5b51d9',
            'i',
          ),
          stake_type: 'LP-USDT',
        },
        {
          $inc: {
            total_generated_amount: amountPerSecond,
          },
        },
        {
          new: true,
          rawResult: true,
        },
      );
      //console.log({ data });
    }
  }

  stakeCompletionDate(time_tenured: number) {
    const currentDate = new Date();
    const endingDate = new Date(currentDate);
    return endingDate.setFullYear(endingDate.getFullYear() + time_tenured);
  }
}
