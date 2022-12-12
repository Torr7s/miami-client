import MiamiClient from './client';

export default class EventBase {
  client: MiamiClient;
  name: string;

  constructor(client: MiamiClient, name: string) {
    this.client = client;
    this.name = name;
  };
}