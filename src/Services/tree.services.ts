// import { Injectable } from '@nestjs/common';
// import { UserNode } from '../Services/user.node.model';
// import { UserService } from 'src/Modules/User/user.service';

// @Injectable()
// export class AffiliateTreeService {
//   private root: UserNode;

//   constructor(private readonly _userService: UserService) {
//     this.root = new UserNode('userA'); // Assuming 'root' is the root user
//     console.log('TS Contructor initialised');
//   }

//   addUser(
//     parentUserId: string,
//     userId: string,
//     amount: number,
//     level: number,
//   ): void {
//     const parentNode = this.findNode(this.root, parentUserId);
//     console.log('PARENT NODE 21-TS', parentNode.userId);

//     if (parentNode) {
//       const newUser = new UserNode(userId);
//       console.log('NEW USER 25-TS', newUser);

//       //parentNode.calculateReward(amount, level);
//       parentNode.addChild(newUser, amount);

//       // addded code
//       //await newUser.createNew();
//     } else {
//       throw new Error('Parent user not found');
//     }
//   }

//   private findNode(rootNode: UserNode | null, userId: string): UserNode | null {
//     console.log('ROOT NODE 58', rootNode);

//     if (!rootNode) {
//       return null;
//     }

//     let stack: UserNode[] = [rootNode];

//     while (stack.length > 0) {
//       const current = stack.pop();

//       if (current?.userId === userId) {
//         return current;
//       }

//       if (current?.children && current.children.length > 0) {
//         stack = stack.concat(current.children);
//       }
//     }

//     // const parentUser = await this._userService.find({
//     //   address: RegExp(rootNode.userId),
//     // });
//     // console.log('PARENT OF ADDED USER', parentUser);

//     return null;
//   }

//   getAffiliateTree(): UserNode {
//     return this.root;
//   }
// }
