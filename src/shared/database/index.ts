import { createConnection, Connection } from 'mongoose';

import config from '../../config';

import { Logger } from '@shared/utils/logger';

const logger: Logger = Logger.it('Mongoose');

logger.clear();

((): void => {
  const connection: Connection = createConnection(config.mongoURI);

  connection.once('open', (): void => {
    logger.info('✔ Conexão estabelecida com sucesso');
  });
})();