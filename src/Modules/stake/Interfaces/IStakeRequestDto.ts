import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IStakeRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  user_address: string;
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
  @IsNotEmpty()
  @ApiProperty()
  stake_apr: number;
  @IsNotEmpty()
  @ApiProperty()
  stake_type: string;
  @IsNotEmpty()
  @ApiProperty()
  time_tenure: number;
}
export class IStakeClaimRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  user_address: string;
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
  @IsNotEmpty()
  @ApiProperty()
  hash: string;
}
export class IIindividualClaimRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  hash: string;
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
export class IStakeClaimAllRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  user_address: string;
  @IsNotEmpty()
  @ApiProperty({ type: [IIindividualClaimRequestDto], isArray: true })
  record: IIindividualClaimRequestDto[];
}
