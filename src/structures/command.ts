import { ApplicationCommandOptionData, PermissionResolvable } from 'discord.js';

import { MiamiClient } from './client';

import { CommandOptions } from '@types';

export class Command implements CommandOptions {
  client: MiamiClient;

  name: string;
  description: string;
  category?: 'Mod' | 'Dev' | 'Info';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms?: PermissionResolvable[];
    memberPerms?: PermissionResolvable[];
  };

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
  }
}