import config from 'config';
import * as mongoose from 'mongoose';

import { MongooseConfigProps } from '@/config/default';
import { Logger } from '@/src/shared/utils/logger';

const databaseConfig: MongooseConfigProps = config.get<
  MongooseConfigProps
>('app.database');

const logger: Logger = Logger.it('Mongoose');

const database: mongoose.Connection = mongoose.createConnection(databaseConfig.mongoURL);

database.once('open', (): void => logger.info('✔ Conexão estabelecida com sucesso'));

export default database;