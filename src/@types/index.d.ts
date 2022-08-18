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
 */
interface CommandOptions {
  name: string;
  description: string;
  category?: 'Mod' | 'Dev' | 'Info' | 'Others';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms?: PermissionResolvable[];
    memberPerms?: PermissionResolvable[];
  };
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

interface MessariAssetMarketData {
  market_data: {
    price_usd: number;
    volume_last_24_hours: number;
    percent_change_usd_last_24_hours: number;
    last_trade_at: string;
  }
}

interface MessariAssetMetrics {
  data: {
    id: string;
    symbol: string;
    name: string;
    marketcap: {
      rank: number;
      marketcap_dominance_percent: number;
      current_marketcap_usd: number;
    };
  } & MessariAssetMarketData;
}