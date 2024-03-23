import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { IDirectRewardLedger } from 'src/Modules/User/Interfaces/IDirectRewardLedger';
import { ILevelRewardLedger } from 'src/Modules/User/Interfaces/ILevelRewardLedger';
import { IUser } from 'src/Modules/User/Interfaces/Iuser';
interface levelWiseUserInfo {
  nodeVolume: number;
  level: number;
  total_level_reward_income: number;
  total_claimed_amount: number;
}
export class LedgerService {
  constructor(
    @InjectModel('levelRewardLedger')
    private readonly LEVEL_REWARD_LEDGER: Model<ILevelRewardLedger & Document>,
    @InjectModel('directRewardLedger')
    private readonly DIRECT_REWARD_LEDGER: Model<
      IDirectRewardLedger & Document
    >,
    @InjectModel('users')
    private readonly USER_DB: Model<IUser & Document>,
  ) {}

  //@Cron(CronExpression.EVERY_5_SECONDS)
  async createLevelLedger(
    amount: number,
    fromLevel: number,
    fromAddress: string,
    toAddress: string,
  ) {
    try {
      const user = await this.LEVEL_REWARD_LEDGER.create({
        address: toAddress,
        fromAddress: fromAddress,
        amount: amount,
        fromLevel: fromLevel,
      });
      return user;
    } catch (error) {
      console.error('createNew from LEVEL_REWARD_LEDGER 16');
      console.error(error);
    }
  }
  async createDirectLedger(
    amount: number,
    fromAddress: string,
    toAddress: string,
  ) {
    try {
      const user = await this.DIRECT_REWARD_LEDGER.create({
        address: toAddress,
        fromAddress: fromAddress,
        amount: amount,
      });

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
      const res = await this.DIRECT_REWARD_LEDGER.findOneAndUpdate(
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

  //get level wise information for particular user
  async getLevelRelatedInfo(userAddress: string) {
    let levelInfo: levelWiseUserInfo[] = [];

    try {
      const data = await this.USER_DB.findOne({ address: userAddress });

      if (data && data.children.length > 0) {
        for (const child of data.children) {
          const userData = await this.USER_DB.findOne({
            address: child.address,
          });

          if (userData) {
            const userLevel = userData.currentuserLevel;
            const nodeVolume = userData.nodeVolume;
            const level_reward_income = userData.levelIncome.active;
            const total_claimed_amount = userData.levelIncome.totalClaimed;

            // Check if there's already an entry for this level
            const existingEntry = levelInfo.find(
              (entry) => entry.level === userLevel,
            );

            if (existingEntry) {
              // If an entry exists, update the nodeVolume
              existingEntry.nodeVolume += nodeVolume;
              existingEntry.total_level_reward_income += level_reward_income;
              existingEntry.total_claimed_amount += total_claimed_amount;
            } else {
              // If no entry exists, create a new one
              const userInfo: levelWiseUserInfo = {
                nodeVolume: nodeVolume,
                level: userLevel - data.currentuserLevel,
                total_level_reward_income: level_reward_income,
                total_claimed_amount: total_claimed_amount,
              };
              levelInfo.push(userInfo);
            }
          }
        }
        console.log(levelInfo);
      } else {
        console.log("User doesn't have children");
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  //direct reward information for particular user
  async getDirectReawrdInfo(userAddress: string) {
    try {
      const data = await this.USER_DB.findOne({ address: userAddress });
      if (data && data.directIncome) {
        const result = {
          active: data.directIncome.active,
          businessVolume: data.directIncome.businessVolume,
          lastClaimedAt: data.directIncome.lastClaimedAt,
          totalClaimed: data.directIncome.totalClaimed,
          totalMember: data.directIncome.totalMember,
          activeMember: data.directIncome.activeMember,
        };
        return result;
      } else {
        console.log('User not found or no directIncome data.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  //calculate user degignation
  async degnationInfo(userAddress: string) {
    const data = await this.USER_DB.findOne({ address: userAddress });
    let nodeVolumeArray = [];
    if (data && data.children.length > 0) {
      for (const child of data.children) {
        const userData = await this.USER_DB.findOne({
          address: child.address,
        });

        nodeVolumeArray.push(userData.nodeVolume);

        // await this.USER_DB.findOneAndUpdate({address : userData.address},{
        //   $set : {
        //     'children.calculatedDegignationVolume' : userData.nodeVolume
        //   }
        // })
      }
      nodeVolumeArray.sort((a, b) => b - a);
      const get40PercentVolume = nodeVolumeArray[0] * (40 / 100);
      const getAnother40PercentVolume = nodeVolumeArray[1] * (40 / 100);

      const sumRemainingVolumes = nodeVolumeArray
        .slice(2)
        .reduce((acc, volume) => acc + volume, 0);
      const totalVolume =
        get40PercentVolume + getAnother40PercentVolume + sumRemainingVolumes;
      console.log({ totalVolume });
    }
  }
}
