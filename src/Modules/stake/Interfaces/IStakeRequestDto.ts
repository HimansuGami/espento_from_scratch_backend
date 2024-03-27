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
  stake_type: number;
  @IsNotEmpty()
  @ApiProperty()
  time_tenure: number;
}
