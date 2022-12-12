import '@/src/shared/database';

import fs from 'node:fs';
import config from 'config';
import Discord from 'discord.js';

import guilds from '@/src/shared/database/models/guilds';
import users from '@/src/shared/database/models/users';

import { join } from 'node:path';
import { Command } from '@/src/typings';

import { Logger } from '@/src/shared/utils/logger';

import { Embed } from '@/src/shared/builders/embed';
import { Button } from '@/src/shared/builders/button';

import { ClientConfigProps } from '@/config/default';

const clientConfig: ClientConfigProps = config.get<
  ClientConfigProps
>('app.client');

/**
 * Represents the main Miami client
 * 
 * @class @extends Discord.Client
 * 
 * @prop {config} config - The client configuration file
 * @prop {Array<Command>} commands - The commands array 
 * @prop {Collection} cooldowns - The collection of command cooldowns
 * @prop {Model<UserSchema>} usersDb - The mongoose user model   
 * @prop {Model<GuildSchema>} guildsDb - The mongoose guild model
 * @prop {Button} button - The button builder
 * @prop {Embed} embed - The embed builder
 */
export default class MiamiClient extends Discord.Client {
  private readonly logger: Logger;

  config: typeof clientConfig;
  commands: Command[];
  cooldowns: Map<string, Map<string, number>>;
  usersDb: typeof users;
  guildsDb: typeof guilds;
  button: typeof Button;
  embed: typeof Embed;

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

    this.config = clientConfig;
    this.logger = Logger.it(this.constructor.name);

    this.commands = [];
    this.button = Button;
    this.embed = Embed;

    this.cooldowns = new Map();

    this.loadEvents();
    this.loadCommands();

    this.guildsDb = guilds;
    this.usersDb = users;
  }

  /**
   * Load client slash commands
   * 
   * @public @method @async
   * 
   * @returns {Promise<void>} void
   */
  public async loadSlashCommands(): Promise<void> {
    await this.guilds.cache.get(this.config.guildId).commands.set(this.commands);
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
      if (category !== '@subCommands') {
        const commands: string[] = fs.readdirSync(`${path}/${category}`);

        for (const command of commands) {
          const Command = require(join(process.cwd(), `${path}/${category}/${command}`)).default;
          const cmd = new (Command)(this);

          this.commands.push(cmd);
        }
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