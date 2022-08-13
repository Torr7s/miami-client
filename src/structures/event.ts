import { MiamiClient } from './client';

/**
 * Represents the basic structure for events
 * 
 * @class 
 * @classdesc Base structure for other events to extend
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 * @prop {String} name - The event name
 */
export class EventBase {
  client: MiamiClient;
  name: string;

  /**
   * Extends EventBase and its properties
   * 
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