import { MiamiClient } from './client';

/**
 * Represents the basic structure for events
 * 
 * @class 
 * @classdesc Basic structure for events
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 * @prop {String} name - The event name
 */
export class EventBase {
  client: MiamiClient;
  name: string;

  /**
   * @constructs EventBase
   * 
   * @param {MiamiClient} client - The MiamiClient instance
   * @param {String} name - The event name 
   */
  constructor(client: MiamiClient, name: string) {
    this.client = client;
    this.name = name;
  };
}