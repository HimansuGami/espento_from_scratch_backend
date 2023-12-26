import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGlobalStats } from './Interfaces/IGolbalStatus';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel('globalstats')
    private readonly globalStatsModel: Model<IGlobalStats & Document>,
  ) {
    console.log('GLOBALSTATS', globalStatsModel);
  }
  getHello(): string {
    return 'Hello World from Analytics service!';
  }
}
