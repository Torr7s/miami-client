import { 
  MessariAssetMarketCapProps, 
  MessariAssetMarketDataProps, 
  MessariAssetMetrics 
} from '@torr7s/messari-client';

export class MessariAssetModel {
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

  private constructor(props: MessariAssetMetrics['data']) {
    const marketData: MessariAssetMarketDataProps = props.market_data;
    const marketCap: MessariAssetMarketCapProps = props.marketcap;

    this.id = props.id;

    this.symbol = props.symbol;
    this.name = props.name;

    this.priceUsd = marketData.price_usd ?? 0;
    this.volumeLast24h = marketData.volume_last_24_hours ?? 0;
    this.percentChangeUsdLast24h = marketData.percent_change_usd_last_24_hours ?? 0;
    this.lastTradeAt = marketData.last_trade_at ?? '0';

    this.rank = marketCap.rank ?? 0;
    this.marketCapDominancePercent = marketCap.marketcap_dominance_percent ?? 0;
    this.currentMarketCapUsd = marketCap.current_marketcap_usd ?? 0;
  }

  static build(props: MessariAssetMetrics['data']): MessariAssetModel {
    return new MessariAssetModel(props);
  }
}