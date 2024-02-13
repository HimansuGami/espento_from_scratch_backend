import { log } from 'console';
import {
  DIST_INCOME_ON_EVENTS_TYPE,
  IUser,
  LevelLogsDto,
} from 'src/Modules/User/Interfaces/Iuser';
import { UserService } from 'src/Modules/User/user.service';

// user-node.model.ts
export class UserNode {
  userId: string;
  constructor(
    userId: string,
    private readonly _userService: UserService,
  ) {
    this.userId = userId;
  }

  async addChild(child: UserNode, amount: number): Promise<IUser> {
    const addedUser = await this.createNew(child, amount);

    //get all parents for this particular user from the database
    const currentChild = await this._userService.findOneAsync({
      address: RegExp(child.userId, 'i'),
    });
    //console.log('ALL CHILD for this particular child', currentChild.children);

    for (const parent of currentChild.allParents) {
      try {
        const parentRecord = await this._userService.findOneAsync({
          address: new RegExp(parent.address, 'i'),
        });

        this.calculateReward(
          amount,
          parent.levelFromCurrentChild,
          parent.address,
          parentRecord,
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
    level: number,
    userId: string,
    parentRecord: IUser,
  ): Promise<void> {
    // -----------------------   Level-wise reward calculation
    const levelRewardPercentage = this.getLevelRewardPercentage(level);
    let levelReward = amount * (levelRewardPercentage / 100);

    //------------------------ Direct reward calculation
    let directReward = 0;
    if (level === 1) {
      const directRewardPercentage = this.getDirectRewardPercentage(level);
      directReward = amount * (directRewardPercentage / 100);
    }

    // Total reward calculation
    parentRecord.approvedClaimAmount = levelReward + directReward;

    await this._userService.findOneAndUpdate(
      { address: new RegExp(parentRecord.address, 'i') },
      {
        $inc: {
          'directIncome.active': directReward,
          'levelIncome.totalClaimed': levelReward,
          approvedClaimAmount: directReward + levelReward,
          'capingLimit.remainingLimit': -levelReward,
          'capingLimit.used': +levelReward,
        },
      },
      {
        new: true,
        rawResult: true,
      },
    );
  }

  private getLevelRewardPercentage(level: number): number {
    const levelRewards = [
      15, 10, 7, 7, 7, 7, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3,
    ];
    return level <= levelRewards.length ? levelRewards[level - 1] : 0;
  }

  private getDirectRewardPercentage(level): number {
    return level === 1 ? 5 : 0; // 5% direct reward if there are direct children, otherwise 0
  }

  //added code

  async createNew(child, amount): Promise<IUser> {
    try {
      const parentUser = await this.getParent(this.userId);
      //console.log('Parent user :::::::::::::', parentUser);

      const user = await this._userService.createNew(child.userId);
      //console.log('User  ::::::::::::::::::: ', user);

      // Fetch immediate parent's parents
      const immediateParentParents = parentUser.allParents || [];

      const parentsToAdd = [
        //add immedeate parent to the current user's allParent array
        {
          address: parentUser.address,
          currentUserLevel: immediateParentParents.length + 1,
          levelFromCurrentChild: 1,
        },
        //add all parent of immediate parent to the current user's allParent array
        ...immediateParentParents.map((parent) => ({
          address: parent.address,
          currentUserLevel: parent.currentUserLevel,
          levelFromCurrentChild: parent.levelFromCurrentChild + 1,
        })),
      ];

      //add parents in child node as well as set other properties as well like parentAddress , refAddress , currentuserLevel and many more
      const currentUser = await this._userService.findOneAndUpdate(
        { address: new RegExp(child.userId) },
        {
          $set: {
            parentAddress: parentUser.address,
            refAddress: parentUser.address,
            currentuserLevel: parentUser.currentuserLevel + 1,
            parentuserLevel: parentUser.currentuserLevel,
            currentuserChildNumber: parentUser.children.length + 1,
            'nodeVolume.total': amount,
            'capingLimit.limit': amount * 3,
            'capingLimit.remainingLimit': amount * 3,
            'capingLimit.used': 0,
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
      const childrens = await this._userService.findOneAndUpdate(
        { address: parentUser.address },
        {
          $push: {
            children: {
              address: currentUser.address,
              childrenNumber: parentUser.children.length + 1,
              parentAddress: parentUser.address,
              currentUserLevel: currentUser.currentuserLevel,
            },
          },
        },
        {
          new: true,
          rawResult: true,
        },
      );
      //console.log('ChildrenArray Of Immediate parent', children);

      // add this current user to all its above parents allParent A array till 20 level (calculate level from bottom to top immedeate parent of current node consider at level 1 and goes above)
      for (const parent of immediateParentParents) {
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
                },
              },
            },
            {
              new: true,
              rawResult: true,
            },
          );
          //console.log('Children Array From Loop ::::::::', children);
        }
      }

      return user;
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  }

  async getParent(address: string) {
    const user = await this._userService.findOneUserAsync(address);
    return user;
  }
}
