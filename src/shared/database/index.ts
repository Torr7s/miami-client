import { Connection, createConnection } from 'mongoose';
import { Logger } from '@shared/utils/logger';

import config from '../../config';

const logger: Logger = Logger.it('Mongoose');

logger.clear();

const database: Connection = createConnection(config.mongoURI);

database.once('open', (): void => logger.info('✔ Conexão estabelecida com sucesso'));

export default database;