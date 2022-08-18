import { ApplicationCommandOptionData, PermissionResolvable } from 'discord.js';

import { MiamiClient } from './client';

import { CommandOptions } from '@types';

/**
 * Represents the basic structure for commands
 * 
 * @class @implements {CommandOptions}
 * @classdesc Basic structure for commands 
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
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
export class CommandBase implements CommandOptions {
  client: MiamiClient;

  name: string;
  description: string;
  category?: 'Dev' | 'Economy' | 'Info' | 'Mod' | 'Others';
  restricted?: boolean;
  options?: ApplicationCommandOptionData[];
  permissions?: {
    appPerms?: PermissionResolvable[];
    memberPerms?: PermissionResolvable[];
  };
  requiresDatabase?: boolean

  /**
   * @constructs Command
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   * @param {CommandOptions} options - The command options 
   * @param {String} options.name - The command name
   * @param {String} options.description - The command description
   * @param {String} options.category - The command category
   * @param {Boolean} [options.restricted] - Wether the command is restricted for its developer
   * @param {Array<ApplicationCommandOptionData>} [options.options] - The options for the command
   * @param {Object} [options.permissions] - The command required permissions
   * @param {Array<PermissionResolvable>} [options.permissions.appPerms] - The required permissions for the app to execute the command
   * @param {Array<PermissionResolvable>} [options.permissions.memberPerms] - The required permissions for the member to execute a command
   * @param {Boolean} [requiresDatabase] - Whether the command requires the database 
   */
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
  }
}