import { MiamiClient } from '@structures/client';
import { EventBase } from '@structures/event';

export default class ReadyEvent extends EventBase {
  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, 'ready');

    this.client = client;
  }

  run = (): void => {
    console.log('Client connected sucessfully');
  }
}