import EventBase from '@/src/structures/event';
import MiamiClient from '@/src/structures/client';

import { Logger } from '@/src/shared/utils/logger';

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