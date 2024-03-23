import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateTreeService } from './Services/tree.services';
import { UserService } from './Modules/User/user.service';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsString,
  isString,
} from 'class-validator';
import { LedgerService } from './Shared/Services/ledger.service';
export class treeDTO {
  @IsEthereumAddress()
  @ApiProperty()
  parentUserAddress: string;
  @IsNotEmpty()
  @IsEthereumAddress()
  @ApiProperty()
  userAddress: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsNumber()
  level: number;
}

@Controller()
@ApiTags('App')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _affiliateTreeService: AffiliateTreeService,
    private _userService: UserService,
    private _ledgerService: LedgerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(':parentUserId/:userId/:amount/:level')
  async addUserToTree(
    @Body() { parentUserAddress, userAddress, amount, level }: treeDTO,
  ): Promise<string> {
    await this._affiliateTreeService.addUser(
      parentUserAddress,
      userAddress,
      amount,
      level,
    );
    return 'User added to the tree successfully!';
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // @Get('trigger-level-reward')
  // async handleCron() {
  //   await this._userNodeModel.getLevelRewardPerBlock(
  //     1,
  //     1000,
  //     '0x0000000000000000000000000000000000000000',
  //   );
  // }

  @Get('/children/:address')
  async getAllChildren(@Param('address') address: string) {
    return this._userService.getAllChildren(address);
  }
  //get level info
  @Get('/levelRewardInfo/:address')
  async getLevelRelatedInfo(@Param('address') address: string) {
    return this._ledgerService.getLevelRelatedInfo(address);
  }
  //get direct info
  @Get('/directRewardInfo/:address')
  async getDirectRelatedInfo(@Param('address') address: string) {
    return await this._ledgerService.getDirectReawrdInfo(address);
  }
  //get degignation info
  @Get('/degignationInfo/:address')
  async degignationInfo(@Param('address') address: string) {
    return await this._ledgerService.degnationInfo(address);
  }
}
