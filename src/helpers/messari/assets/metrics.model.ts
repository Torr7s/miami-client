import { MessariAssetMetrics, MessariAssetMetricsModelProps } from '@types';

/**
 * Represents the model for an asset
 * 
 * @class @implements {MessariAssetMetricsModelProps}
 * 
 * @prop {String} id - The asset id
 * @prop {String} symbol - The asset symbol
 * @prop {String} name - The asset name
 * @prop {Number} priceUsd - The asset price in USD
 * @prop {Number} volumeLast24h - The asset volume in the last 24h
 * @prop {Number} percentChangeUsdLast24h - The asset 24h change percentage
 * @prop {String} lastTradeAt - The asset last trade timestamp
 * @prop {Number} rank - The asset rank
 * @prop {Number} marketCapDominancePercent - The asset market capital dominance percentage
 * @prop {Number} currentMarketCapUsd - The asset current market capital value in USD 
 */
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

  /**
   * @constructs MessariAssetMetricsModel
   * 
   * @param {MessariAssetMetrics} props - The asset metrics  
   */
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

  /**
   * Build an asset model
   * 
   * @param {MessariAssetMetrics} props - The asset metrics
   *  
   * @returns {MessariAssetMetricsModel} - The asset model builded 
   */
  static build(props: MessariAssetMetrics): MessariAssetMetricsModel {
    return new MessariAssetMetricsModel(props);
  }
}