// affiliate-tree.service.ts
import { Injectable } from '@nestjs/common';
import { UserNode } from './user.node.model';
import { UserService } from 'src/Modules/User/user.service';
import { IUser } from 'src/Modules/User/Interfaces/Iuser';

@Injectable()
export class AffiliateTreeService {
  private root: UserNode;

  constructor(private readonly _userService: UserService) {
    this.root = new UserNode(
      '0x0000000000000000000000000000000000000000',
      _userService,
    );
  }

  async addUser(
    parentUserId: string,
    userId: string,
    amount: number,
    level: number,
  ): Promise<void> {
    try {
      const parentNode = await this.findNode(this.root, parentUserId);
      if (parentNode instanceof UserNode) {
        const newUser = new UserNode(userId, this._userService);
        await parentNode.addChild(newUser, amount);
      } else {
        throw new Error('Parent user not found');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error appropriately
    }
  }

  private async findNode(
    rootNode: UserNode | null,
    userId: string,
  ): Promise<UserNode | null | IUser> {
    try {
      if (rootNode.userId === userId) return rootNode;

      await this._userService.findOneUserAsync(userId);
      return new UserNode(userId, this._userService);
    } catch (error) {
      console.error('Error while finding parent user:', error);
      return null;
    }
  }

  getAffiliateTree(): UserNode {
    return this.root;
  }
}
