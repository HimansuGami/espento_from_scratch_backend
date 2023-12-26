import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalStatsSchema } from './entity/globalStats.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'globalstats', schema: GlobalStatsSchema },
    ]),
  ],
  controllers: [],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
