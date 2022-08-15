import fs from 'node:fs';
import config from '../config';

import * as Discord from 'discord.js';

import { join } from 'node:path';
import { Command } from '@types';
import { Logger } from '@shared/utils/logger';

/**
 * Represents the main Miami client
 * 
 * @class @extends Discord.Client
 * 
 * @prop {config} config - The main client environment variables
 * @prop {Array<Command>} commands - The commands array 
 */
export class MiamiClient extends Discord.Client {
  private readonly logger: Logger;

  config: typeof config;
  commands: Command[];

  /**
   * Create a new MiamiClient instance
   * 
   * @constructs MiamiClient
   */
  constructor() {
    const clientOptions: Discord.ClientOptions = {
      allowedMentions: {
        parse: [
          'roles',
          'users'
        ],
        repliedUser: true
      },
      intents: 33551,
      presence: {
        activities: [
          {
            name: 'Being built up',
            type: Discord.ActivityType.Playing
          }
        ]
      }
    }

    super(clientOptions);

    this.logger = Logger.it(this.constructor.name);

    this.config = config;
    this.commands = [];

    this.loadEvents();
    this.loadCommands();
  }

  /**
   * Load client slash commands
   * 
   * @public @method @async
   * 
   * @returns {Promise<void>} void
   */
  public async loadSlashCommands(): Promise<void> {
    const slashes: Discord.Collection<string, Discord.ApplicationCommand<{}>> = await this.guilds.cache.get(this.config.guildId).commands.set(this.commands);

    this.logger.info(`Comandos em barra carregados: [${slashes.size}]`);
  }

  /**
   * Load and start client events
   * 
   * @private @method
   * 
   * @param {String} path - The events folder path
   * 
   * @returns {void} void
   */
  private loadEvents(path: string = 'src/events'): void {
    const categories: string[] = fs.readdirSync(path);

    for (const category of categories) {
      const events: string[] = fs.readdirSync(`${path}/${category}`);

      for (const evt of events) {
        const Event = require(join(process.cwd(), `${path}/${category}/${evt}`)).default;
        const event = new (Event)(this);

        if (event.name === 'ready') {
          super.once('ready', (...args) => event.run(...args))
        } else {
          super.on(event.name, (...args) => event.run(...args));
        }
      }
    }
  }

  /**
   * Load and start client commands
   * 
   * @private @method
   * 
   * @param {String} path - The commands folder path
   * 
   * @returns {void} void
   */
  private loadCommands(path: string = 'src/commands'): void {
    const categories: string[] = fs.readdirSync(path);

    for (const category of categories) {
      const commands: string[] = fs.readdirSync(`${path}/${category}`);

      for (const command of commands) {
        const Command = require(join(process.cwd(), `${path}/${category}/${command}`)).default;
        const cmd = new (Command)(this);

        this.commands.push(cmd);
      }
    }
  }

  /**
   * Log the client in
   * 
   * @public @method @async
   * 
   * @returns {Promise<String>} token - The token of the account used
   */
  public login(): Promise<string> {
    return super.login(this.config.token);
  }
}