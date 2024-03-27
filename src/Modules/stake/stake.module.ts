import { Module } from '@nestjs/common';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StakeLedgerSchema } from './Entities/stake.ledger.entity';
import { StakeRewardLedgerSchema } from './Entities/stake.reward.ledger.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'stakeledger', schema: StakeLedgerSchema },
      { name: 'stakerewardledger', schema: StakeRewardLedgerSchema },
    ]),
  ],
  controllers: [StakeController],
  providers: [StakeService],
})
export class StakeModule {}
