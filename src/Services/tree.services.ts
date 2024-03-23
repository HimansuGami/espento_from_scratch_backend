// affiliate-tree.service.ts
import { Injectable } from '@nestjs/common';
import { UserNodeService } from './user.node.service';
import { UserService } from 'src/Modules/User/user.service';
import { IUser } from 'src/Modules/User/Interfaces/Iuser';
import { RewardService } from './reward.service';

@Injectable()
export class AffiliateTreeService {
  constructor(
    private readonly _userService: UserService,
    private readonly _userNodeService: UserNodeService,
  ) {}

  async addUser(
    parentUserAddress: string,
    userAddress: string,
    amount: number,
    level: number,
  ): Promise<void> {
    try {
      const parentNode = await this.idParentExist(parentUserAddress);
      if (parentNode) {
        await this._userNodeService.addUser(
          parentUserAddress,
          userAddress,
          amount,
        );
      } else {
        //create user without parent address
        await this._userService.createNew(userAddress);
        console.log('USER DOES?T HAVE REFFRAL ADDRESS ::');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async idParentExist(userId: string): Promise<IUser | null> {
    try {
      const parentUser = await this._userService.findOneUserAsync(userId);
      return parentUser;
    } catch (error) {
      console.error('Error while finding parent user:', error);
      return null;
    }
  }
}
