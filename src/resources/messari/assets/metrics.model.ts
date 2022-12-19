import { MessariAssetMetrics, MessariAssetMetricsModelProps } from '@/src/typings';

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

    this.priceUsd = marketData.price_usd ?? 0;
    this.volumeLast24h = marketData.volume_last_24_hours ?? 0;
    this.percentChangeUsdLast24h = marketData.percent_change_usd_last_24_hours ?? 0;
    this.lastTradeAt = marketData.last_trade_at ?? '0';

    this.rank = marketCap.rank ?? 0;
    this.marketCapDominancePercent = marketCap.marketcap_dominance_percent ?? 0;
    this.currentMarketCapUsd = marketCap.current_marketcap_usd ?? 0;
  }

  static build(props: MessariAssetMetrics): MessariAssetMetricsModel {
    return new MessariAssetMetricsModel(props);
  }
}