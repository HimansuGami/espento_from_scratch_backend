import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateTreeService } from './Services/tree.services';
import { UserService } from './Modules/User/user.service';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _affiliateTreeService: AffiliateTreeService,
    private _userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':parentUserId/:userId/:amount/:level')
  async addUserToTree(
    @Param('parentUserId') parentUserId: string,
    @Param('userId') userId: string,
    @Param('amount') amount: number,
    @Param('level') level: number,
  ): Promise<string> {
    await this._affiliateTreeService.addUser(
      parentUserId,
      userId,
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
}
