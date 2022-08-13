import { ApplicationCommandOptionData, PermissionResolvable } from 'discord.js';

import { CommandContext } from '@structures/commandContext';

interface CommandOptions {
  name: string;
  description: string;
  category?: 'Mod' | 'Dev' | 'Info';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms: PermissionResolvable[];
    memberPerms: PermissionResolvable[];
  };
}

interface Command extends CommandOptions {
  run: (ctx: CommandContext) => void;
}