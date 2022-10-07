import { Connection, createConnection } from 'mongoose';
import { Logger } from '@/src/shared/utils/logger';

import config from './config';

const logger: Logger = Logger.it('Mongoose');

const database: Connection = createConnection(config.mongoURI);

database.once('open', (): void => logger.info('✔ Conexão estabelecida com sucesso'));

export default database;