import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStakeLedger } from './Interfaces/IStakeLedger';
import { IStakeRewardLedger } from './Interfaces/IStakeRewardLedger';
import { Cron } from '@nestjs/schedule';
import { time } from 'console';

interface IUpdatedStakeRecordLog {
  user_address: string;
  total_expected_amount: number;
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
    const data = await this.STAKE_REWARD_LEDGER.create({
      user_address: user_address,
      stake_type: stake_type,
      stake_apr: stake_apr,
      amount: amount,
      total_expected_amount: this.calculateRewardAmount(
        amount,
        stake_apr,
        time_tenure,
      ),
      time_tenured: time_tenure,
      per_second_apr: this.calculateAprPerSecond(stake_apr, time_tenure),
      starting_date: new Date(),
      ending_date: this.stakeCompletionDate(time_tenure),
    });
    let updatedStakeRecordLog: IUpdatedStakeRecordLog = {
      user_address: user_address,
      total_expected_amount: data.total_expected_amount,
      total_claimed_amount: data.total_claimed_amount,
      total_generated_amount: data.total_generated_amount,
      stake_type: stake_type,
      stake_apr: stake_apr,
    };
    console.log({ updatedStakeRecordLog });

    const returned_obj = {
      data: updatedStakeRecordLog,
      message: 'stake created successfully',
      statusCode: 200,
    };
    return returned_obj;
  }

  calculateRewardAmount(
    amount: number,
    stake_apr: number,
    time_tenure: number,
  ): number {
    const total_receivable_amount =
      amount + ((amount * stake_apr) / 100) * time_tenure;
    return total_receivable_amount;
  }

  calculateAprPerSecond(stake_apr: number, time_tenure: number) {
    const stake_apr_per_second = stake_apr / 365 / 86400;
    console.log({ stake_apr_per_second });
    return stake_apr_per_second;
  }

  stakeCompletionDate(time_tenured: number) {
    const currentDate = new Date();
    const endingDate = new Date(currentDate);
    return endingDate.setFullYear(endingDate.getFullYear() + time_tenured);
  }
}
