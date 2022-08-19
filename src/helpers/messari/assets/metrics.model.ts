import { MessariAssetMetrics, MessariAssetMetricsModelProps } from '@types';

export class MessariAssetMetricsModel implements MessariAssetMetricsModelProps {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  volumeLast24h: number;
  percentChangeUsdLast24h: number;
  lastTradeAt: string;
  rank: number;
  marketCapDominancePercent: number;
  currentMarketCapUsd: number;

  private constructor(props: MessariAssetMetrics) {
    const marketData = props.data.market_data;
    const marketCap = props.data.marketcap;

    this.id = props.data.id;

    this.symbol = props.data.symbol;
    this.name = props.data.name;
    
    this.priceUsd = marketData.price_usd;
    this.volumeLast24h = marketData.volume_last_24_hours;
    this.percentChangeUsdLast24h = marketData.percent_change_usd_last_24_hours;
    this.lastTradeAt = marketData.last_trade_at;
    
    this.rank = marketCap.rank;
    this.marketCapDominancePercent = marketCap.marketcap_dominance_percent;
    this.currentMarketCapUsd = marketCap.current_marketcap_usd;
  }

  static build(props: MessariAssetMetrics): MessariAssetMetricsModel {
    return new MessariAssetMetricsModel(props);
  }
}