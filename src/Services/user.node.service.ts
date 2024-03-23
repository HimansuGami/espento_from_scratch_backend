import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { IUser } from 'src/Modules/User/Interfaces/Iuser';
import { UserService } from 'src/Modules/User/user.service';
import {
  BLOCKS_PER_DAY,
  FARM_APR,
  FARM_TENURE,
} from 'src/Shared/Constants/shared.constant';
import { LedgerService } from 'src/Shared/Services/ledger.service';
import { RewardService } from './reward.service';

// user-node.model.ts
export class UserNodeService {
  constructor(
    @InjectModel('users')
    private readonly USER_DB: Model<IUser & Document>,
    private readonly _userService: UserService,
    private readonly _rewardService: RewardService,
  ) {}

  async addUser(
    parentUserAddress: string,
    userAddress: string,
    amount: number,
  ): Promise<IUser> {
    const addedUser = await this.createNew(
      parentUserAddress,
      userAddress,
      amount,
    );

    //get all parents for this particular user from the database

    //==================================> need to dounle check is this below line of code is necessary
    const currentUser = await this.USER_DB.findOne({
      address: userAddress,
    });
    //console.log('ALL CHILD for this particular child', all_parrnts_of_current_child.children);

    for (const parent of currentUser.allParents) {
      try {
        this.calculateReward(
          amount,
          parent.levelFromCurrentChild,
          userAddress,
          parent.address,
        );
      } catch (error) {
        console.error(
          `Error fetching record for address ${parent.address}: ${error.message}`,
        );
      }
    }
    return addedUser;
  }

  async calculateReward(
    amount: number,
    fromLevel: number,
    fromAddress: string,
    toAddress: string,
  ): Promise<void> {
    // -----------------------   Level-wise reward calculation
    this._rewardService.getLevelRewardPerBlock(
      amount,
      fromLevel,
      fromAddress,
      toAddress,
    );

    //------------------------ Direct reward calculation
    this._rewardService.getDirectRewardPercentage(
      amount,
      fromLevel,
      fromAddress,
      toAddress,
    );
  }

  async createNew(parentUserAddress, childAddress, amount): Promise<IUser> {
    try {
      //getparent user record
      const parentUser = await this.getParent(parentUserAddress);
      //console.log('Parent user :::::::::::::', parentUser);

      //create user
      const create_user = await this._userService.createNew(childAddress);
      //console.log('User  ::::::::::::::::::: ', user);

      // Fetch immediate parent's parents
      const parents_Of_immediate_parent = parentUser.allParents || [];

      const parentsToAdd = [
        //add immedeate parent to the current user's allParent array
        {
          address: parentUser.address,
          currentUserLevel: parents_Of_immediate_parent.length + 1,
          levelFromCurrentChild: 1,
        },
        //add all parent of immediate parent to the current user's allParent array
        ...parents_Of_immediate_parent.map((parent) => ({
          address: parent.address,
          currentUserLevel: parent.currentUserLevel,
          levelFromCurrentChild: parent.levelFromCurrentChild + 1,
        })),
      ];

      //add parents in child node as well as set other properties as well like parentAddress , refAddress , currentuserLevel and many more
      const currentUser = await this._userService.findOneAndUpdate(
        { address: new RegExp(childAddress) },
        {
          $set: {
            parentAddress: parentUser.address,
            refAddress: parentUser.address,
            currentuserLevel: parentUser.currentuserLevel + 1,
            parentuserLevel: parentUser.currentuserLevel,
            currentuserChildNumber: parentUser.children.length + 1,
            nodeVolume: amount,
            'capingLimit.limit': amount * 3,
            'capingLimit.remainingLimit': amount * 3,
            'capingLimit.used': 0,
            'investments.lastInvestedAt': new Date(),
          },
          $inc: {
            'investments.total': amount,
          },
          $push: {
            allParents: {
              $each: parentsToAdd,
            },
          },
        },
        {
          new: true,
          rawResult: true,
        },
      );
      //console.log('Current Updated User ::::::::::::', currentUser);

      //update children array of immedeate parent of current user(I mean add this child in children Array) //===> update children array of parent user of current user
      await this._userService.findOneAndUpdate(
        { address: parentUser.address },
        {
          $push: {
            children: {
              address: currentUser.address,
              childrenNumber: parentUser.children.length + 1,
              parentAddress: parentUser.address,
              currentUserLevel: currentUser.currentuserLevel,
              childLevelFromParent:
                currentUser.currentuserLevel - parentUser.currentuserLevel,
            },
          },
          $inc: {
            'directIncome.businessVolume': amount,
            'directIncome.totalMember': 1,
            'levelIncome.activeLevels': 1,
            nodeVolume: amount,
          },
        },
        {
          new: true,
          rawResult: true,
        },
      );

      // add this current user to all its above parents allParent array till 20 level (calculate level from bottom to top immedeate parent of current node consider at level 1 and goes above)
      for (const parent of parents_Of_immediate_parent) {
        const parentChildrenArray = await this._userService.findOneAsync({
          address: parent.address,
        });
        if (parent.currentUserLevel <= 20) {
          const children = await this._userService.findOneAndUpdate(
            { address: parent.address },
            {
              $push: {
                children: {
                  address: currentUser.address,
                  currentUserLevel: currentUser.currentuserLevel,
                  childrenNumber: parentChildrenArray.children.length + 1,
                  parentAddress: parent.address,
                  childLevelFromParent:
                    currentUser.currentuserLevel - parent.currentUserLevel,
                },
              },
              $inc: {
                'directIncome.businessVolume': amount,
                'directIncome.totalMember': 1,
                'levelIncome.activeLevels': 1,
                nodeVolume: amount,
              },
            },
            {
              new: true,
              rawResult: true,
            },
          );
        }
      }

      return currentUser;
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  }

  async getParent(address: string) {
    const user = await this.USER_DB.findOne({ address: address });
    return user;
  }

  async updateParentRecord(address: string) {
    await this._userService.findOneAndUpdate({ address: address }, {});
  }
}
