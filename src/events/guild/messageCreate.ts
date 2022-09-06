import { ChannelType, Message } from 'discord.js';

import EventBase from '../../structures/event';
import MiamiClient from '../../structures/client';

/**
 * Represents a MessageCreate client event
 * 
 * @class @extends EventBase
 * @classdesc Emitted whenever a message is created
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class MessageCreateEvent extends EventBase {
  client: MiamiClient;

  /**
   * @constructs MessageCreateEvent
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, 'messageCreate');

    this.client = client;
  }

  /**
   * Used to handle created messages
   * 
   * @public @method @async
   * 
   * @param {Message} message - The created message
   * 
   * @returns {Promise<Message<boolean> | void>} message | void 
   */
  async run(message: Message): Promise<Message<boolean> | void> {
    const { author, channel, guild, member } = message;

    if (author.bot || channel.type === ChannelType.DM) return;

    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`))) {
      if (message.channel.type === ChannelType.GuildText) {
        return message.reply({
          isMessage: true,
          content: `Olá, ${message.author}.`
        });
      }
    }
  }
}