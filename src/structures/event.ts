import { ClientEvents } from 'discord.js';
import { Event } from '../typings';

import MiamiClient from './client';

export default class EventBase implements Event {
  client: MiamiClient;
  name: keyof ClientEvents;

  constructor(client: MiamiClient, name: keyof ClientEvents) {
    this.client = client;
    this.name = name;
  };
}