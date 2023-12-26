import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';

@Controller()
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Get('/transaction')
  getHello(): string {
    return this._transactionService.getHello();
  }
}
