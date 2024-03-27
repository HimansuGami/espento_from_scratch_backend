import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  Document,
  FilterQuery,
  Model,
  ObjectId,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { ALL_BLOCKLISTED_USERS_ADDRESS, IUser } from './Interfaces/Iuser';
import { log } from 'console';
import { API_RESPONSE } from 'src/Shared/Interfaces/Ishared.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private readonly USER_DB: Model<IUser & Document>,
    private readonly _configService: ConfigService,
  ) {
    // const userName = this._configService.get<string>(
    //   'USER_NAME',
    //   'DEFAULT VALUE IS himansu',
    // );
    // const isProd = this._configService.get<boolean>('isProd');
    // const email = this._configService.get<string>('EMAIL');
    // const emailAPI = this._configService.get<string>('PARENT_EMAIL');
    // const uName = this._configService.get<string>('DATABASE.USER_NAME');
    // const url = this._configService.get<string>('DATABASE.url');
    // const isLocal = this._configService.get<Function>('DATABASE.isLocal');
    // console.log(userName, 'USERNAME');
    // console.log(isProd, 'isProd');
    // console.log(email, 'email');
    // console.log(emailAPI, 'emailAPI');
    // console.log(uName, 'uName');
    // console.log(url, 'url');
    // console.log(isLocal(), 'isLocal');

    console.log('USER_DB', USER_DB);
  }

  async getHello(): Promise<API_RESPONSE> {
    return {
      message: 'Hello from user service',
      data: 'hiii',
    };
  }

  //below function add user in the DB using DTO
  async addUserAsync(userDto: IUser): Promise<API_RESPONSE> {
    try {
      const DATA = await this.USER_DB.create(userDto);
      return {
        message: 'User Added successfully',
        data: DATA,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error, 'ERROR FROM USER_SERVICE 44');
    }
  }

  //below function get single user by address from the DB
  async findOneUserAsync(userAddress: string): Promise<IUser | null> {
    try {
      const result = await this.USER_DB.findOne({ address: userAddress });
      return result;
    } catch (error) {
      console.log(error, 'ERROR FROM USER_SERVICE 58');
    }
  }

  //below function get single user by address from the DB
  async findOneAsync(
    obj: FilterQuery<IUser & Document<any, any, any>>,
    projection?:
      | ProjectionType<IUser & Document<any, any, any>>
      | null
      | undefined,
  ): Promise<IUser | null> {
    try {
      return await this.USER_DB.findOne(obj, projection);
    } catch (error) {
      console.log(error, 'ERROR FROM USER_SERVICE 73');
    }
  }

  //below function get all users from the DB
  async findAllAync(
    obj: FilterQuery<IUser & Document<any, any, any>>,
    projection?:
      | ProjectionType<IUser & Document<any, any, any>>
      | null
      | undefined,
  ): Promise<IUser[]> {
    try {
      return await this.USER_DB.find(obj, projection);
    } catch (error) {
      console.log(error, 'ERROR FROM USER_SERVICE 88');
    }
  }

  //below function find user based on filter parameter
  async find(
    obj: FilterQuery<IUser & Document<any, any, any>>,
    projection?:
      | ProjectionType<IUser & Document<any, any, any>>
      | null
      | undefined,
  ) {
    try {
      return await this.USER_DB.find(obj, projection);
    } catch (error) {
      console.log(error, 'ERROR FROM USER_SERVICE 102');
    }
  }

  //below function count total number of users in the DB
  async count(): Promise<number> {
    try {
      return await this.USER_DB.find({}).countDocuments();
    } catch (error) {
      console.log(error, 'ERROR FROM USER_SERVICE 111');
    }
  }

  //below function findByIdAndUpdate in user entry in DB
  async findByIdAndUpdate(
    id: ObjectId | any,
    update: UpdateQuery<IUser>,
    options?: (QueryOptions & { rawResult: true; new: true }) | null,
  ) {
    console.log('ID', id);
    console.log('UPDATE', update);

    try {
      return this.USER_DB.findByIdAndUpdate(id, update, options);
    } catch (error) {
      console.error('findOneByIdAndUpdate from USER_SERVICE 118');
      console.error(error);
    }
  }

  //below function find user based on filter and update it
  async findOneAndUpdate(
    filter: FilterQuery<IUser & Document<any, any, any>>,
    update: UpdateQuery<IUser>,
    options?: QueryOptions & { rawResult: true; new: true },
  ) {
    try {
      const res = await this.USER_DB.findOneAndUpdate(filter, update, options);
      return res;
    } catch (error) {
      console.error('findOneAndUpdate from USER_SERVICE 159');
      console.error(error);
    }
  }

  //below function create new user based on address that they have and remaining filed assigned by it's default value
  async createNew(address: string) {
    try {
      const user = this.USER_DB.create({ address: address });
      return user;
    } catch (error) {
      console.error('createNew from USER_SERVICE 170');
      console.error(error);
    }
  }

  //below function check is user member or not
  async isUserMember(userAddress: string): Promise<boolean> {
    try {
      const user = await this.findOneUserAsync(userAddress);
      console.log('USER', user);

      return user.isMemeber;
    } catch (error) {
      console.error('isUserMember from USER_SERVICE 183');
      console.error(error);
    }
  }

  //below method check isUserBlocked based on address that user have
  async isUserBlocked(userAddress: string): Promise<boolean> {
    try {
      const user = await this.findOneUserAsync(userAddress);

      return user.isUserBlocked;
    } catch (error) {
      console.error('isUserBlocked from USER_SERVICE 183');
      console.error(error);
    }
  }

  //below method will gives an addresses of all blocklisted users as well as the count of blocklisted user from the DB
  async allBlockListedUsersAddresses(): Promise<ALL_BLOCKLISTED_USERS_ADDRESS> {
    const blockedUsers: IUser[] = await this.findAllAync(
      { isUserBlocked: true },
      {},
    );
    const blockedUsersAddresses: string[] =
      await this.getAddressFromBlockedUsers(blockedUsers);

    const count: number = (await blockedUsersAddresses).length;
    return {
      blockedUsersAddresses,
      count,
    };
  }

  //below method is to get all blocklisted users addresses
  getAddressFromBlockedUsers = async (
    blockedUsers: IUser[],
  ): Promise<string[]> => {
    const users: IUser[] = blockedUsers;
    const addresses = users.map((user) => user.address);
    return addresses;
  };

  async getAllChildren(address: string) {
    const children = await this.USER_DB.find({ refAddress: address });
    console.log({ child: children.length });

    const groupedChildren = children.reduce((result, child) => {
      const level = child.currentuserLevel;
      const levelIncome = child.levelIncome.active;
      const existingEntry = result.find(
        (entry) => entry.currentuserLevel === level,
      );

      if (existingEntry) {
        existingEntry.nodeVolume += child.nodeVolume;
        existingEntry.levelIncome.active += child.levelIncome.active;
      } else {
        result.push({
          currentuserLevel: level,
          nodeVolume: child.nodeVolume,
        });
      }

      return result;
    }, []);

    console.log({ groupedChildren });

    groupedChildren.forEach(async (item) => {
      await this.USER_DB.findOneAndUpdate(
        { address: address },
        {
          $push: {
            'levelIncome.levelLogs': {
              totalNodeVolume: item.nodeVolume,
              fromLevel: item.currentuserLevel,
            },
          },
        },
      );
    });

    return children;
  }
}
