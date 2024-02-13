import { Document } from 'mongoose';
import { IUser } from 'src/Modules/User/Interfaces/Iuser';
import { UserService } from 'src/Modules/User/user.service';

// user-node.model.ts
export class UserNode {
  userId: string;
  children: UserNode[];
  totalReward: number;
  directReward: number;
  levelReward: number;
  parents: UserNode[];
  currentuserLevel: number;
  currentuserChildNumber: number = 0;
  parentUserLevel: number;

  constructor(
    userId: string,
    private readonly _userService?: UserService,
  ) {
    this.userId = userId;
    this.children = [];
    this.totalReward = 0;
    this.directReward = 0;
    this.levelReward = 0;
    this.currentuserLevel = 1;
    this.parentUserLevel = 0;
    this.parents = [];
    console.log('UNM Contructor initialised');
  }

  addChild(child: UserNode, amount: number): void {
    this.children.push(child);
    // console.log(
    //   'PARENTS CHILDREN UNM',
    //   this.children,
    //   'Of user : ',
    //   this.userId,
    // );

    //console.log('THIS', this, 'AND THIS.PARENTS : ', this.parents);

    //this.createNew(child.userId);
    // Set child's parent user level and current user level
    child.parentUserLevel = this.currentuserLevel;
    child.currentuserLevel = this.currentuserLevel + 1;

    // Increment the child number of the parent
    child.currentuserChildNumber = this.children.length;

    child.parents = [...this.parents, this];

    // Apply calculateReward for each parent in allParents
    child.getAllParents().forEach((parent) => {
      //console.log('PARENT FROM LOOP', parent);

      parent.calculateReward(
        amount,
        child.currentuserLevel - parent.currentuserLevel,
        parent.userId,
      );
    });

    const allParents = child.getAllParents();
    // console.log('All Parents:', allParents);
  }

  calculateReward(amount: number, level: number, userId: string): void {
    //console.log('LEVEL', level);

    // -----------------------   Level-wise reward calculation
    const levelRewardPercentage = this.getLevelRewardPercentage(level);
    //console.log('LEVEL REWARD PERCENTAGE', levelRewardPercentage);
    const levelReward = amount * (levelRewardPercentage / 100);

    this.levelReward += levelReward;
    //console.log('LEVEL REWARD', this.levelReward);

    //------------------------ Direct reward calculation
    if (level === 1) {
      const directRewardPercentage = this.getDirectRewardPercentage(level);
      const directReward = amount * (directRewardPercentage / 100);
      this.directReward += directReward;
      console.log('DIRECT REWARD', this.directReward);
    }

    // Total reward calculation
    this.totalReward = this.levelReward + this.directReward;
    console.log(
      'TOTAL REWARD FOR LEVEL : ',
      level,
      ' is : ',
      this.totalReward,
      'for user : ',
      userId,
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

  getAllParents(parents: UserNode[] = []): UserNode[] {
    return [...parents, ...this.parents];
  }

  toJSON(): object {
    return {
      userId: this.userId,
      children: this.children.map((child) => child.toJSON()), // recursively call toJSON for children
      totalReward: this.totalReward,
      directReward: this.directReward,
      levelReward: this.levelReward,
      currentuserLevel: this.currentuserLevel,
      currentuserChildNumber: this.currentuserChildNumber,
      parentUserLevel: this.parentUserLevel,
    };
  }

  //added code

  async createNew(userId: string): Promise<void> {
    //console.log('USER ID ', userId);

    try {
      const user = this._userService.createNew(userId);
      //console.log('RETUREN STORED USER ', user);

      // Log the rewards
      //this.logRewards(amount, level);
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  }

  async getIUser(): Promise<IUser | null> {
    if (!this._userService) {
      console.error('UserService not provided.');
      return null;
    }

    try {
      const userDataArray: Document<
        unknown,
        {},
        IUser & Document<any, any, any>
      >[] = await this._userService.find({
        address: this.userId,
      });

      // Assuming you want the first user if there are multiple matches
      const userData: IUser | undefined = userDataArray[0]?.toObject() as IUser;

      return userData;
    } catch (error) {
      console.error('Error while fetching IUser:', error);
      return null;
    }
  }
}
