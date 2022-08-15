import { createConnection, Connection } from 'mongoose';

import config from '../../config';

import { Logger } from '@shared/utils/logger';

import { guildsDb } from './models/guild';
import { usersDb } from './models/user';

export class DatabaseManager {
  private readonly logger: Logger;

  guilds: typeof guildsDb;
  users: typeof usersDb;

  constructor() {
    this.logger = Logger.it(this.constructor.name);
    this.logger.clear();

    this.connect();
  }

  private connect(): void {
    const connection: Connection = createConnection(config.mongoURI);

    connection.once('open', (): void => {
      this.logger.info('✔ Conexão estabelecida com sucesso');
    });
  }
}