import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  IIindividualClaimRequestDto,
  IStakeClaimAllRequestDto,
  IStakeClaimAllWithHashRequestDto,
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
  @Post('addStake')
  async addStake(
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
  @Post('stakeClaim')
  async stakeClaim(
    @Body()
    { amount, user_address, hash }: IStakeClaimRequestDto,
  ): Promise<API_RESPONSE> {
    return await this._stakeService.stakeClaimAsync(user_address, amount, hash);
  }
  @Post('stakeAllClaim')
  async stakeClaimAll(
    @Body()
    { user_address, record }: IStakeClaimAllRequestDto,
  ): Promise<API_RESPONSE> {
    return await this._stakeService.stakeClaimAllAsync(user_address, record);
  }
  @Post('stakeAllActualClaim')
  async stakeClaimActual(
    @Body()
    { user_address, record }: IStakeClaimAllWithHashRequestDto,
  ): Promise<API_RESPONSE> {
    return await this._stakeService.stakeClaimActual(user_address, record);
  }
}
