import { ApplicationCommandOptionData, PermissionResolvable } from 'discord.js';

import MiamiClient from './client';

import { CommandOptions } from '@/src/typings';

export default class CommandBase implements CommandOptions {
  client: MiamiClient;

  name: string;
  description: string;
  category?: 'Dev' | 'Info' | 'Mod' | 'Others';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms?: PermissionResolvable[];
    memberPerms?: PermissionResolvable[];
  };
  requiresDatabase?: boolean
  cooldown?: number;

  constructor(client: MiamiClient, options: CommandOptions) {
    this.client = client;

    this.name = options.name;
    this.description = options.description;
    this.category = options.category;
    this.restricted = options.restricted ?? false;
    this.options = options.options;
    this.permissions = {
      appPerms: options.permissions?.appPerms ?? [],
      memberPerms: options.permissions?.memberPerms ?? []
    };
    this.requiresDatabase = options.requiresDatabase ?? false;
    this.cooldown = options.cooldown || 3;
  }
}