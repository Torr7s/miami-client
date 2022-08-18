import { MessariAssetMetrics } from '@types';

export class MessariAssetMetricsModel {
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
    this.id = props.data.id;
    this.symbol = props.data.symbol;
    this.name = props.data.name;
    this.priceUsd = props.data.market_data.price_usd;
    this.volumeLast24h = props.data.market_data.volume_last_24_hours;
    this.percentChangeUsdLast24h = props.data.market_data.percent_change_usd_last_24_hours;
    this.lastTradeAt = props.data.market_data.last_trade_at;
    this.rank = props.data.marketcap.rank;
    this.marketCapDominancePercent = props.data.marketcap.marketcap_dominance_percent;
    this.currentMarketCapUsd = props.data.marketcap.current_marketcap_usd;
  }

  static build(props: MessariAssetMetrics): MessariAssetMetricsModel {
    return new MessariAssetMetricsModel(props);
  }
}