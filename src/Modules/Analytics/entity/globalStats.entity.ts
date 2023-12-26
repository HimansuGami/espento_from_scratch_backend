import { Schema } from 'mongoose';
import { IGlobalStats } from '../Interfaces/IGolbalStatus';

export const GlobalStatsSchema = new Schema<IGlobalStats>(
  {
    bscScan: {
      total_totaltxns: { type: String, default: '5,089' }, // 16Jun2023 18:46 GMT
      total_Holders: { type: String, default: '528' }, // 16Jun2023 18:46 GMT
    },
    coinGecko: {
      cg24HourTradingVol: { type: String, default: '$20,978.00' }, // 16Jun2023 18:46 GMT
      cgLiquidity: { type: String, default: '$218,456' }, // 16Jun2023 18:46 GMT
      cgFullyDilutedValuation: { type: String, default: '$9,744,197' }, // 16Jun2023 18:46 GMT
    },
    home: {
      tradingVolume: { type: Number, default: 0, min: 0 },
      rewardClaimed: { type: Number, default: 0, min: 0 },
      totalLiquidity: { type: Number, default: 0, min: 0 },
      activeUsers: { type: Number, default: 0, min: 0 },
    },
    swap: {
      totalVolume: { type: Number, default: 0, min: 0 },
      totalSpentTraded: { type: Number, default: 0, min: 0 },
      totalEusdTraded: { type: Number, default: 0, min: 0 },
      totalFeeGenerated: { type: Number, default: 0, min: 0 },
    },
    liquidity: {
      totalVolume: { type: Number, default: 0, min: 0 },
      totalSpentAdded: { type: Number, default: 0, min: 0 },
      totalEusdAdded: { type: Number, default: 0, min: 0 },
      totalLpReceived: { type: Number, default: 0, min: 0 },
    },
    // bridge: {
    //   totalVolume: { type: Number, default: 0, min: 0 },
    //   totalSupplied: { type: Number, default: 0, min: 0 },
    //   totalReceived: { type: Number, default: 0, min: 0 },
    //   totalFeeGenerated: { type: Number, default: 0, min: 0 },
    // },
    // farm: {
    //   totalLpAdded: { type: Number, default: 0, min: 0 },
    //   totalVolumeUsd: { type: Number, default: 0, min: 0 },
    //   totalRewardsClaimed: { type: Number, default: 0, min: 0 },
    //   totalFarmEnterCount: { type: Number, default: 0, min: 0 },
    // },
    stake: {
      totalLpAdded: { type: Number, default: 0, min: 0 },
      totalVolumeUsd: { type: Number, default: 0, min: 0 },
      totalRewardsClaimed: { type: Number, default: 0, min: 0 },
      totalStakeEnterCount: { type: Number, default: 0, min: 0 },
    },
    // borrow: {
    //   totalVolume: { type: Number, default: 0, min: 0 },
    //   totalInterestRepayed: { type: Number, default: 0, min: 0 },
    //   totalBorrowed: { type: Number, default: 0, min: 0 },
    //   totalFeeGenerated: { type: Number, default: 0, min: 0 },
    // },
  },
  { timestamps: true, strict: false },
);
GlobalStatsSchema.plugin(require('mongoose-paginate'));
GlobalStatsSchema.plugin(require('mongoose-delete'));
