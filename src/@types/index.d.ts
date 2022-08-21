import {
  APIEmbedField,
  APIMessageComponentEmoji,
  ApplicationCommandOptionData,
  EmbedAssetData,
  EmbedAuthorOptions,
  EmbedFooterData,
  PermissionResolvable
} from 'discord.js';

import { CommandContext } from '@structures/commandContext';

import { CommandBase } from '@structures/command';

/**
 * Options interface for Commands
 * 
 * @interface
 * 
 * @prop {String} name - The command name
 * @prop {String} description - The command description
 * @prop {String} category - The command category
 * @prop {Boolean} [restricted] - Wether the command is restricted for its developer
 * @prop {Array<ApplicationCommandOptionData>} [options] - The options for the command
 * @prop {Object} [permissions] - The command required permissions 
 * @prop {Array<PermissionResolvable>} [permissions.appPerms] - The required permissions for the app to execute the command
 * @prop {Array<PermissionResolvable>} [permissions.memberPerms] - The required permissions for the member to execute a command
 * @prop {Boolean} [requiresDatabase] - Whether the command requires the database 
 */
interface CommandOptions {
  name: string;
  description: string;
  category?: 'Dev' | 'Economy' | 'Info' | 'Mod' | 'Others';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms?: PermissionResolvable[];
    memberPerms?: PermissionResolvable[];
  };
  requiresDatabase?: boolean;
  cooldown?: number;
}

/**
 * Interface that represents a Command
 * 
 * @interface
 */
interface Command extends CommandOptions {
  /**
   * Run Command instances
   * 
   * @public @method
   * 
   * @param {CommandContext} ctx - The CommandContext instance 
   */
  run(ctx: CommandContext): void;
}

/**
 * Options interface for a Button
 * 
 * @prop {String} custom_id - The buttom custom id
 * @prop {Boolean} [disabled] - Wether the button is disabled
 * @prop {APIMessageComponentEmoji} [emoji] - The button emoji to be displayed
 * @prop {String} label - The button label 
 * @prop {ButtonStyle} style: The button style
 */
interface ButtonOptions {
  custom_id: string;
  disabled?: boolean;
  emoji?: APIMessageComponentEmoji;
  label: string;
  style: ButtonStyle;
  url?: string;
}

/**
 * Options interface for an Embed
 * 
 * @interface
 * 
 * @prop {EmbedOptions} options - The embed options
 * @prop {EmbedAuthorOptions} [options.author] - The embed author options
 * @prop {Number} [options.color] - The embed color
 * @prop {String} [options.description] - The embed description
 * @prop {Array<APIEmbedField>} [options.fields] - The embed fields
 * @prop {EmbedFooterData} [options.footer] - The embed footer options
 * @prop {EmbedAssetData} [options.thumbnail] - The embed thumbnail
 * @prop {Number} [options.timestamp] - The embed timestamp
 * @prop {String} [options.title] - The embed title
 * @prop {String} [options.url] - The embed URL
 */
interface EmbedOptions {
  author?: EmbedAuthorOptions;
  color?: number;
  description?: string;
  fields?: APIEmbedField[];
  footer?: EmbedFooterData;
  thumbnail?: EmbedAssetData;
  timestamp?: number;
  title?: string;
  url?: string;
}

interface MessariAssetMetricsProps {
  marketcap: {
    rank: number;
    marketcap_dominance_percent: number;
    current_marketcap_usd: number;
  };
  market_data: {
    price_usd: number;
    volume_last_24_hours: number;
    percent_change_usd_last_24_hours: number;
    last_trade_at: string;
  }
}

/**
 * Interface for typing return response from Messari api
 * 
 * @interface
 * 
 * @prop {Object} data - The current asset data;
 * @prop {String} data.id - The asset id
 * @prop {String} data.symbol - The asset symbol
 * @prop {String} data.name - The asset name
 * @prop {Object} data.marketcap - The asset marketcap
 * @prop {Number} data.marketcap.rank - The asset marketcap rank
 * @prop {Number} data.marketcap.marketcap_dominance_percent - The asset market capital dominance percentage
 * @prop {Number} data.marketcap.current_marketcap_usd - The asset current market capital value in USD 
 * @prop {Object} data.market_data - The asset market data
 * @prop {number} data.market_data.price_usd - The price of a single asset in USD
 * @prop {Number} data.market_data.volume_last_24_hours - The asset volume in the last 24h
 * @prop {Number} data.market_data.percent_change_usd_last_24_hours - The asset 24h change percentage
 * @prop {String} data.market_data.last_trade_at - The asset last trade timestamp
 */
interface MessariAssetMetrics {
  data: {
    id: string;
    symbol: string;
    name: string;
  } & MessariAssetMetricsProps;
}

interface MessariAllAssets {
  data: Array<{
    id: string;
    symbol: string;
    name: string;
    metrics: MessariAssetMetricsProps
  }>
}

/**
 * Interface for messari asset metrics model 
 * 
 * @interface
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
interface MessariAssetMetricsModelProps {
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
}