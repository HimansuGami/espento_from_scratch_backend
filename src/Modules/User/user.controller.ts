import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ALL_BLOCKLISTED_USERS_ADDRESS, IUser } from './Interfaces/Iuser';
import mongoose from 'mongoose';
import { API_RESPONSE } from 'src/Shared/Interfaces/Ishared.interface';

@Controller()
@ApiTags('User')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('/hello')
  async getHello(): Promise<API_RESPONSE> {
    return await this._userService.getHello();
  }

  @Post('addUser')
  async addUser(@Body() userDto: IUser): Promise<API_RESPONSE> {
    return await this._userService.addUserAsync(userDto);
  }

  @Get('getUser/:address')
  async getUser(@Param('id') address: string): Promise<IUser | null> {
    return await this._userService.findOneUserAsync(address);
  }

  @Get('getAllUser')
  async getAllUser(): Promise<IUser[]> {
    return await this._userService.findAllAync({}, {});
  }

  @Get('getAllBlockListedUsersAddress')
  async getAllBlockListedUsersAddress(): Promise<ALL_BLOCKLISTED_USERS_ADDRESS> {
    return await this._userService.allBlockListedUsersAddresses();
  }

  @Get('isUserMember/:address')
  async isUserMember(@Param('address') address: string): Promise<boolean> {
    return await this._userService.isUserMember(address);
  }

  @Get('isUserBlock/:address')
  async isUserBlock(@Param('address') address: string): Promise<boolean> {
    return await this._userService.isUserBlocked(address);
  }

  @Post('addUserByAddress/:address')
  async addUserByAddress(@Param('address') address: string) {
    return await this._userService.createNew(address);
  }

  @Post('findByAddressAndUpdate/:address')
  async findByAddressAndUpdate(@Param('address') address: string) {
    return await this._userService.findOneAndUpdate(
      { address: new RegExp(address, 'i') },
      { $set: { isMemeber: true, childNumber: 1 } },
    );
  }

  @Post('findByIdAndUpdate/:id')
  async findByIdAndUpdate(@Param('id') id: string) {
    return await this._userService.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { isMemeber: true, childNumber: 10 } },
    );
  }
}
