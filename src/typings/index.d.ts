import {
  APIEmbedField,
  APIMessageComponentEmoji,
  ApplicationCommandOptionData,
  ClientEvents,
  EmbedAssetData,
  EmbedAuthorOptions,
  EmbedFooterData,
  PermissionResolvable
} from 'discord.js';

import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '../structures/client';

interface CommandOptions {
  name: string;
  description: string;
  category?: 'Dev' | 'Info' | 'Mod' | 'Others';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms?: PermissionResolvable[];
    memberPerms?: PermissionResolvable[];
  };
  requiresDatabase?: boolean;
  cooldown?: number;
}

interface Command extends CommandOptions {
  run(ctx: CommandContext): void;
}

interface Event {
  client: MiamiClient;
  name: keyof ClientEvents
}

interface ButtonOptions {
  custom_id: string;
  disabled?: boolean;
  emoji?: APIMessageComponentEmoji;
  label: string;
  style: ButtonStyle;
  url?: string;
}

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