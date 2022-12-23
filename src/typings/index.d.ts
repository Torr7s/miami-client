import {
  APIEmbedField,
  APIMessageComponentEmoji,
  ApplicationCommandOptionData,
  CacheType,
  ClientEvents,
  CollectedInteraction,
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
  requiresDatabase?: {
    guild?: boolean;
    user?: boolean;
  };
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

interface ClientUtils {
  handleUndeferredInteraction(interaction: CollectedInteraction<CacheType>);
}