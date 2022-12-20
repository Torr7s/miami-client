import '@/src/shared/database';

import fs from 'node:fs';
import config from 'config';
import Discord from 'discord.js';

import guilds from '@/src/shared/database/models/guilds';
import users from '@/src/shared/database/models/users';

import { join } from 'node:path';
import { Command } from '@/src/typings';

import { Logger } from '@/src/shared/utils/logger';

import { EmbedComponent } from '@/src/shared/components/embed';
import { ButtonComponent } from '@/src/shared/components/button';

import { ClientConfigProps } from '@/config/default';

const clientConfig: ClientConfigProps = config.get<
  ClientConfigProps
>('app.client');

export default class MiamiClient extends Discord.Client {
  private readonly logger: Logger;

  public config: typeof clientConfig;
  public commands: Command[];
  public cooldowns: Map<string, Map<string, number>>;
  public usersDb: typeof users;
  public guildsDb: typeof guilds;
  public button: typeof ButtonComponent;
  public embed: typeof EmbedComponent;

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
    this.button = ButtonComponent;
    this.embed = EmbedComponent;

    this.cooldowns = new Map();

    this.loadEvents();
    this.loadCommands();

    this.guildsDb = guilds;
    this.usersDb = users;
  }

  public async loadSlashCommands(): Promise<void> {
    await this.guilds.cache.get(this.config.guildId).commands.set(this.commands);
  }

  private loadEvents(path: string = 'src/events'): void {
    const categories: string[] = fs.readdirSync(path);

    for (const category of categories) {
      const events: string[] = fs.readdirSync(`${path}/${category}`);

      for (const evt of events) {
        const normalizedPath: string = join(process.cwd(), `${path}/${category}/${evt}`);

        const Event: any = require(normalizedPath).default;
        const event = new (Event)(this);

        if (event.name === 'ready') {
          super.once('ready', (...args) => event.run(...args))
        } else {
          super.on(event.name, (...args) => event.run(...args));
        }
      }
    }
  }

  private loadCommands(path: string = 'src/commands'): void {
    const categories: string[] = fs.readdirSync(path);

    for (const category of categories) {
      const commands: string[] = fs.readdirSync(`${path}/${category}`);

      for (const command of commands) {
        const normalizedPath: string = join(process.cwd(), `${path}/${category}/${command}`);

        const Command: any = require(normalizedPath).default;
        const cmd = new (Command)(this);

        this.commands.push(cmd);
      }
    }
  }

  public login(): Promise<string> {
    return super.login(this.config.token);
  }
}