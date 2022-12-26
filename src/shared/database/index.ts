import mongoose from 'mongoose';
import config from 'config';

import { DatabaseConfigProps } from '@/config/default';

import { Logger } from '@/src/shared/utils/logger';

const databaseConfig: DatabaseConfigProps = config.get<
  DatabaseConfigProps
>('app.database');

const database: mongoose.Connection = mongoose.createConnection(
  databaseConfig
    .mongoose
    .url
);

database.once('open', (): void => Logger.it('Mongoose').info('✔ Conexão estabelecida com sucesso'));

export default database;