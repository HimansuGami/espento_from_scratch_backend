import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './entity/transaction.entity';
import { RewardsLedgerSchema } from './entity/rewardLedger.entity';
import { MembersLedgerSchema } from './entity/membersLedger.entity';
import { ClaimAndFlushLedgerSchema } from './entity/claimAndFlushLedger.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'transactions', schema: TransactionSchema },
      { name: 'rawtransactions', schema: TransactionSchema },
      { name: 'rewardsledger', schema: RewardsLedgerSchema },
      { name: 'membersledger', schema: MembersLedgerSchema },
      { name: 'claimAndflushledger', schema: ClaimAndFlushLedgerSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
