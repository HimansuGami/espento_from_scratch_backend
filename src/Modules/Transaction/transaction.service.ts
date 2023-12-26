import { Injectable } from '@nestjs/common';
import { Itransaction } from './Interfaces/ITransaction';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { IRewards } from './Interfaces/IRward';
import { IMembers } from './Interfaces/IMembers';
import { IClaimAndFlush } from './Interfaces/IClaimAndFlush';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('transactions')
    private readonly transactionModel: Model<Itransaction & Document>,
    @InjectModel('rawtransactions')
    private readonly rawTransactionModel: Model<Itransaction & Document>,
    @InjectModel('rewardsledger')
    private readonly rewardLedgerModel: Model<IRewards & Document>,
    @InjectModel('membersledger')
    private readonly membersLedgerModel: Model<IMembers & Document>,
    @InjectModel('claimAndflushledger')
    private readonly claimAndFlushLedgerModel: Model<IClaimAndFlush & Document>,
  ) {
    console.log('TRANSACTION', transactionModel);
    console.log('RAWTRANSACTION', rawTransactionModel);
    console.log('REWARDLEDGER', rewardLedgerModel);
    console.log('MEMBERSLEDGER', membersLedgerModel);
    console.log('CLAIMANDFLUSHLEDGER', claimAndFlushLedgerModel);
  }
  getHello(): string {
    return 'Hello World from transaction service!';
  }
}
