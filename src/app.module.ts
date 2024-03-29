import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './Modules/User/user.module';
import configuration from './config/configuration';
import { AdminModule } from './Modules/Admin/admin.module';
import { DatabaseModule } from './Modules/Mongoose_Database/database.module';
import { TransactionModule } from './Modules/Transaction/transaction.module';
import { AnalyticsModule } from './Modules/Analytics/analytics.module';
import { AffiliateTreeService } from './Services/tree.services';
import { ScheduleModule } from '@nestjs/schedule';
import { LedgerService } from './Shared/Services/ledger.service';
import { UserNodeService } from './Services/user.node.service';
import { RewardService } from './Services/reward.service';
import { StakeModule } from './Modules/Stake/Stake.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ignoreEnvVars : true,
      load: configuration,
      cache: true,
      expandVariables: true,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UserModule,
    AdminModule,
    TransactionModule,
    AnalyticsModule,
    StakeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AffiliateTreeService,
    LedgerService,
    UserNodeService,
    RewardService,
  ],
})
export class AppModule {}
