import {
  MessariAssetMarketCapProps,
  MessariAssetMarketDataProps,
  MessariAssetMetrics
} from '@torr7s/messari-client';

export class MessariAssetModel {
  public readonly id: string;
  public readonly symbol: string;
  public readonly name: string;

  public readonly rank: number;
  public readonly marketCapDominancePercent: number;
  public readonly currentMarketCapUSD: number;
  public readonly outstandingMarketCapUSD: number;
  public readonly realizedMarketCapUSD: number;

  public readonly priceUSD: number;
  public readonly volumeLast24h: number;
  public readonly realVolumeLast24h: number;
  public readonly percentChangeLast1hUSD: number;
  public readonly percentChangeLast24hUSD: number;
  public readonly lastTradeAt: string;

  public readonly redditActiveUsers: number;
  public readonly redditSubscribers: number;

  private constructor({ data }: MessariAssetMetrics) {
    const assetMarketCap: MessariAssetMarketCapProps = data.marketcap;
    const assetMarketData: MessariAssetMarketDataProps = data.market_data;

    this.id = data.id;
    this.symbol = data.symbol;
    this.name = data.name;

    this.rank = assetMarketCap.rank;
    this.marketCapDominancePercent = assetMarketCap.marketcap_dominance_percent;
    this.currentMarketCapUSD = assetMarketCap.current_marketcap_usd;
    this.outstandingMarketCapUSD = assetMarketCap.outstanding_marketcap_usd;
    this.realizedMarketCapUSD = assetMarketCap.realized_marketcap_usd;

    this.priceUSD = assetMarketData.price_usd;
    this.volumeLast24h = assetMarketData.volume_last_24_hours;
    this.realVolumeLast24h = assetMarketData.real_volume_last_24_hours;
    this.percentChangeLast1hUSD = assetMarketData.percent_change_usd_last_1_hour;
    this.percentChangeLast24hUSD = assetMarketData.percent_change_usd_last_24_hours;
    this.lastTradeAt = assetMarketData.last_trade_at;
    
    this.redditActiveUsers = data.reddit.active_user_count;
    this.redditSubscribers = data.reddit.subscribers;

    MessariAssetModel.$validate(this);
  }

  public static build({ data }: MessariAssetMetrics): MessariAssetModel {
    return new MessariAssetModel({ data });
  }

  private static $validate(obj: object): void {
    return Object.keys(obj).forEach((key: string) => obj[key] ?? (obj[key] = 0));
  }
}