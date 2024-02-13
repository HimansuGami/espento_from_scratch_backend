import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateTreeService } from './Services/tree.services copy';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _affiliateTreeService: AffiliateTreeService,
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
}
