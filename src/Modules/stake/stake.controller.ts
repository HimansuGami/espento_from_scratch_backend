import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  IStakeClaimRequestDto,
  IStakeRequestDto,
} from './Interfaces/IStakeRequestDto';
import { API_RESPONSE } from 'src/Shared/Interfaces/Ishared.interface';
import { StakeService } from './stake.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('stake')
@ApiTags('Stake')
export class StakeController {
  constructor(private readonly _stakeService: StakeService) {}
  @Post('addStake/:user_address/:amount/:stake_apr/:stake_type/:time_tenure')
  async addUser(
    @Body()
    {
      amount,
      user_address,
      stake_apr,
      stake_type,
      time_tenure,
    }: IStakeRequestDto,
  ): Promise<API_RESPONSE> {
    return await this._stakeService.addStakeAsync(
      amount,
      user_address,
      stake_apr,
      stake_type,
      time_tenure,
    );
  }
  @Post('stakeClaim/:user_address/:amount/:hash')
  async stakeClaim(
    @Body()
    { amount, user_address, hash }: IStakeClaimRequestDto,
  ): Promise<API_RESPONSE> {
    return await this._stakeService.stakeClaimAsync(user_address, amount, hash);
  }
}
