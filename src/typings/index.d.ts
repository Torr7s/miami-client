import {
  APIEmbedField,
  APIMessageComponentEmoji,
  ApplicationCommandOptionData,
  EmbedAssetData,
  EmbedAuthorOptions,
  EmbedFooterData,
  PermissionResolvable
} from 'discord.js';

import CommandContext from '@/src/structures/commandContext';

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

interface GithubUserProps {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  site_admin: boolean
  name: string;
  company: string;
  location: string;
  email: string;
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