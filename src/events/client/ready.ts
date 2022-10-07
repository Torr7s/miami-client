import EventBase from '@/src/structures/event';
import MiamiClient from '@/src/structures/client';

import { Logger } from '@/src/shared/utils/logger';

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

    this.logger.info(`✔ ${this.client.user.tag} conectado com sucesso`);
  }
}