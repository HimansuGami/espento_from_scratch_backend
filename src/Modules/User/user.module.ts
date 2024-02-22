import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entity/user.entity';
import { LedgerService } from 'src/Shared/Services/ledger.service';
import { LevelRewardLedgerSchema } from './entity/levelRewardLedger.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'levelRewardLedger', schema: LevelRewardLedgerSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, LedgerService],
  exports: [UserService, MongooseModule],
  //if we want to use this user model then we have to export MongooseModule from the userModule
})
export class UserModule {}
