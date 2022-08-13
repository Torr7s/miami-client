import { ApplicationCommandOptionData, PermissionResolvable } from 'discord.js';

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