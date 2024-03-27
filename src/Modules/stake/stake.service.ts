import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStakeLedger } from './Interfaces/IStakeLedger';
import { IStakeRewardLedger } from './Interfaces/IStakeRewardLedger';
import * as crypto from 'crypto';
import { API_RESPONSE } from 'src/Shared/Interfaces/Ishared.interface';
import {
  IIindividualClaimRequestDto,
  IIindividualClaimWithHashRequestDto,
} from './Interfaces/IStakeRequestDto';
interface IUpdatedStakeRecordLog {
  user_address: string;
  hash: string;
  total_expected_amount: number;
  total_claimed_amount: number;
  total_remaining_amount: number;
  stake_type: string;
  stake_apr: number;
}
interface IStakeClaimLog {
  user_address: string;
  total_claimed_amount: number;
  last_claimed_at: Date;
  claimed_amount: number;
}
interface IStakeClaimAllLog {
  user_address: string;
  total_claimed_amount: number;
  data: IStakeClaimAllData[];
}
interface IStakeClaimAllData {
  claimed_amount: number;
  hash: string;
}
interface IStakeClaimAllWithHashLog {
  user_address: string;
  total_claimed_amount: number;
  data: IStakeClaimAllData[];
}
interface IStakeClaimAllWithHashData {
  claimed_amount: number;
  hash: string;
  time_difference: number;
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
    try {
      const data = await this.STAKE_LEDGER.create({
        user_address: user_address,
        hash: this.generateHash(),
        stake_type: stake_type,
        stake_apr: stake_apr,
        amount: amount,
        total_expected_amount: this.calculateRewardAmount(
          amount,
          stake_apr,
          time_tenure,
        ),
        total_remaining_amount: this.calculateRewardAmount(
          amount,
          stake_apr,
          time_tenure,
        ),
        time_tenured: time_tenure,
        per_second_apr: this.calculateAprPerSecond(stake_apr, time_tenure),
        per_second_dollar_value:
          this.calculateRewardAmount(amount, stake_apr, time_tenure) /
          (time_tenure * 365 * 86400),
        starting_date: new Date(),
        ending_date: this.stakeCompletionDate(time_tenure),
      });
      let updatedStakeRecordLog: IUpdatedStakeRecordLog = {
        user_address: user_address,
        hash: data.hash,
        total_expected_amount: data.total_expected_amount,
        total_claimed_amount: data.total_claimed_amount,
        total_remaining_amount: data.total_remaining_amount,
        stake_type: stake_type,
        stake_apr: stake_apr,
      };

      const returned_obj = {
        data: updatedStakeRecordLog,
        message: 'stake created successfully',
        statusCode: 200,
      };
      console.log({ returned_obj });
      return returned_obj;
    } catch (err) {
      console.log(`Error in stake creation: ${err}`);
      console.log({ err: err.short_description });
    }
  }

  async stakeClaimAsync(
    user_address: string,
    amount: number,
    hash: string,
  ): Promise<API_RESPONSE> {
    try {
      const data = await this.STAKE_LEDGER.findOneAndUpdate(
        {
          user_address: user_address,
          hash: hash,
          total_remaining_amount: { $gte: amount },
        },
        {
          $inc: {
            total_claimed_amount: amount,
            total_remaining_amount: -amount,
          },
          $set: { last_claimed_at: new Date() },
        },
        { new: true, rawResult: true },
      );

      if (data) {
        await this.STAKE_REWARD_LEDGER.create({
          user_address: user_address,
          stake_type: data.stake_type,
          stake_apr: data.stake_apr,
          amount: amount,
          hash: this.generateHash(),
        });

        const stakeClaimLog: IStakeClaimLog = {
          user_address: data.user_address,
          total_claimed_amount: data.total_claimed_amount,
          last_claimed_at: data.last_claimed_at,
          claimed_amount: amount,
        };

        const returned_obj: API_RESPONSE = {
          data: stakeClaimLog,
          message: 'stake claimed successfully',
          statusCode: 200,
        };

        console.log({ returned_obj });
        return returned_obj;
      } else {
        console.log(`${user_address} is not eligible for claim`);
      }
    } catch (err) {
      console.log(`Error in stake claim: ${err}`);
      throw new Error('Error in stake claim');
    }
  }

  async stakeClaimAllAsync(
    user_address: string,
    record: IIindividualClaimRequestDto[],
  ): Promise<API_RESPONSE> {
    try {
      let stake_data: IStakeClaimAllData[] = [];
      let total_amount = 0;
      for (const claimRecord of record) {
        const data = await this.STAKE_LEDGER.findOneAndUpdate(
          {
            hash: claimRecord.hash,
            total_remaining_amount: { $gte: claimRecord.amount },
          },
          {
            $inc: {
              total_claimed_amount: claimRecord.amount,
              total_remaining_amount: -claimRecord.amount,
            },
            $set: { last_claimed_at: new Date() },
          },
          { new: true, rawResult: true },
        );
        if (data) {
          const individualClaimRecord = await this.STAKE_REWARD_LEDGER.create({
            user_address: user_address,
            stake_type: data.stake_type,
            stake_apr: data.stake_apr,
            amount: claimRecord.amount,
            hash: this.generateHash(),
          });

          stake_data.push({
            hash: individualClaimRecord.hash,
            claimed_amount: individualClaimRecord.amount,
          });
          total_amount += claimRecord.amount;
        } else {
          console.log(`${user_address} is not eligible for claim`);
        }
      }

      const stakeClaimAllLog: IStakeClaimAllLog = {
        user_address: user_address,
        total_claimed_amount: total_amount,
        data: stake_data,
      };
      const returned_obj: API_RESPONSE = {
        data: stakeClaimAllLog,
        message: 'stake claimed successfully',
        statusCode: 200,
      };
      console.log({ returned_obj });
      return returned_obj;
    } catch (err) {
      console.log(`Error in stake claim: ${err}`);
      throw new Error('Error in stake claim');
    }
  }

  async stakeClaimActual(
    user_address: string,
    record: IIindividualClaimWithHashRequestDto[],
  ): Promise<API_RESPONSE> {
    try {
      console.log('HIII');

      let stake_data: IStakeClaimAllWithHashData[] = [];
      let total_amount = 0;
      for (const claimRecord of record) {
        const stake_data_1 = await this.STAKE_LEDGER.findOne({
          hash: claimRecord.hash,
        });

        const starting_date = new Date(stake_data_1.starting_date).getTime();
        const current_date = new Date().getTime();
        const time_difference = (current_date - starting_date) / 1000;
        const claim_amount =
          time_difference * stake_data_1.per_second_dollar_value;

        const data = await this.STAKE_LEDGER.findOneAndUpdate(
          {
            hash: claimRecord.hash,
          },
          {
            $inc: {
              total_claimed_amount: claim_amount,
              total_remaining_amount: -claim_amount,
            },
            $set: { last_claimed_at: new Date() },
          },
          { new: true, rawResult: true },
        );
        if (data) {
          const individualClaimRecord = await this.STAKE_REWARD_LEDGER.create({
            user_address: user_address,
            stake_type: data.stake_type,
            stake_apr: data.stake_apr,
            amount: claim_amount,
            hash: this.generateHash(),
          });

          stake_data.push({
            hash: individualClaimRecord.hash,
            claimed_amount: individualClaimRecord.amount,
            time_difference: time_difference,
          });
          total_amount += claim_amount;
        } else {
          console.log(`${user_address} is not eligible for claim`);
        }
      }

      const stakeClaimAllLog: IStakeClaimAllWithHashLog = {
        user_address: user_address,
        total_claimed_amount: total_amount,
        data: stake_data,
      };
      const returned_obj: API_RESPONSE = {
        data: stakeClaimAllLog,
        message: 'stake claimed successfully',
        statusCode: 200,
      };
      console.log({ returned_obj });
      return returned_obj;
    } catch (err) {
      console.log(`Error in stake claim: ${err}`);
      throw new Error('Error in stake claim');
    }
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
    return stake_apr_per_second;
  }

  stakeCompletionDate(time_tenured: number) {
    const currentDate = new Date();
    const endingDate = new Date(currentDate);
    return endingDate.setFullYear(endingDate.getFullYear() + time_tenured);
  }

  generateHash(): string {
    const data = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return `0x${hash.digest('hex')}`;
  }
}
