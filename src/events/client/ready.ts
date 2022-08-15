import { MiamiClient } from '@structures/client';
import { EventBase } from '@structures/event';

import { Logger } from '@shared/utils/logger';

/**
 * Represents a Ready client event
 * 
 * @class @extends EventBase
 * @classdesc Emitted when the client becomes ready to start working
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class ReadyEvent extends EventBase {
  private readonly logger: Logger;

  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, 'ready');

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }

  run = async (): Promise<void> => {
    await this.client.loadSlashCommands();

    this.logger.info('Client connected successfully');
  }
}