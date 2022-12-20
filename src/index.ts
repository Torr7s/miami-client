import 'dotenv/config';
import './shared/utils/alias';

import MiamiClient from './structures/client';

import { Logger } from './shared/utils/logger';

const logger: Logger = Logger.it('App');

process.on('unhandledRejection', (reason: unknown): void => {
  logger.error('An UNHANDLED PROMISE has been found: ', reason);
});

process.on('uncaughtException', (error: Error): void => {
  logger.error('An UNCAUGHT EXCEPTION has been found: ', error);
  process.exit(1);
});

(async (): Promise<void> => {
  const miamiClient: MiamiClient = new MiamiClient();

  await miamiClient.login();
})();
