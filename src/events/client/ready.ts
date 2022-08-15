import { MiamiClient } from '@structures/client';
import { EventBase } from '@structures/event';

import Logger from '@shared/utils/logger';

export default class ReadyEvent extends EventBase {
  private readonly logger: Logger;

  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, 'ready');

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }

  run = (): void => {
    this.logger.info('Client connected successfully');
  }
}