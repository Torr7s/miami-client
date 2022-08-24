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
 * Interface type for Command options
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
 * Interface type for Commands
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
 * Interface type for Button options
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
 * Interface type for Embed options
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

/**
 * Interface type for an asset properties
 * 
 * @interface
 * 
 * @prop {Object} marketcap - The asset market capital
 * @prop {Number} marketcap.rank - The asset rank in the market
 * @prop {Number} marketcap.marketcap_dominance_percent - The asset percentage of market dominance
 * @prop {Number} marketcap.current_marketcap_usd - The asset current value in USD
 * @prop {Object} market_data - The asset market data
 * @prop {Number} market_data.price_usd - The asset price in USD
 * @prop {Number} market_data.volume_last_24_hours - The asset volume in the last 24h
 * @prop {Number} market_data.percent_change_usd_last_24_hours - The asset change percentage in the last 24h
 * @prop {Number} market_data.last_trade_at - The asset last trade timestamp
 */
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
 * Interface type for an asset
 * 
 * @interface
 * 
 * @prop {Object} data - The current asset data;
 * @prop {String} data.id - The asset id
 * @prop {String} data.symbol - The asset symbol
 * @prop {String} data.name - The asset name
 * @prop {MessariAssetMetricsProps} data.marketcap - The asset market capital
 * @prop {MessariAssetMetricsProps} data.market_data - The asset marketdata
 */
interface MessariAssetMetrics {
  data: {
    id: string;
    symbol: string;
    name: string;
  } & MessariAssetMetricsProps;
}

/**
 * Interface type to get all assets
 * 
 * @interface
 * 
 * @prop {Array<Object>} data - The asset data
 * @prop {String} data.id - The asset id
 * @prop {String} data.symbol - The asset symbol
 * @prop {String} data.name - The asset name
 * @prop {MessariAssetMetricsProps} metrics - The asset metrics
 */
interface MessariAllAssets {
  data: Array<{
    id: string;
    symbol: string;
    name: string;
    metrics: MessariAssetMetricsProps
  }>
}

/**
 * Interface type for asset model building 
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

interface GithubUserProps {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  site_admin: boolean
  name: string;
  company: string | null;
  location: string | null;
  email: string | null;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GithubRepositoryProps {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: Pick<GithubUserProps, 'avatar_url'>
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    name: string;
  };
  visibility: string;
  default_branch: string;
  watchers: number;
}