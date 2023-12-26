export class IGlobalStats {
  bscScan: bscScanStats;
  coinGecko: coinGeckoStats;
  home: {
    tradingVolume: number;
    rewardClaimed: number;
    totalLiquidity: number;
    activeUsers: number;
  };
  swap: {
    totalVolume: number;
    totalSpentTraded: number;
    totalEusdTraded: number;
    totalFeeGenerated: number;
  };
  liquidity: {
    totalVolume: number;
    totalSpentAdded: number;
    totalEusdAdded: number;
    totalLpReceived: number;
  };
  //   bridge: {
  //     totalVolume: number;
  //     totalSupplied: number;
  //     totalReceived: number;
  //     totalFeeGenerated: number;
  //   };
  //   farm: {
  //     totalLpAdded: number;
  //     totalVolumeUsd: number;
  //     totalRewardsClaimed: number;
  //     totalFarmEnterCount: number;
  //   };
  stake: {
    totalLpAdded: number;
    totalVolumeUsd: number;
    totalRewardsClaimed: number;
    totalStakeEnterCount: number;
  };
  //   borrow: {
  //     totalVolume: number;
  //     totalInterestRepayed: number;
  //     totalBorrowed: number;
  //     totalFeeGenerated: number;
  //   };
}
export class bscScanStats {
  total_totaltxns: string;
  total_Holders: string;
}
export class coinGeckoStats {
  cg24HourTradingVol: string;
  cgLiquidity: string;
  cgFullyDilutedValuation: string;
}
