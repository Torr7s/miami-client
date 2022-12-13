import { ChannelType, Message } from 'discord.js';

import EventBase from '@/src/structures/event';
import MiamiClient from '@/src/structures/client';

export default class MessageCreateEvent extends EventBase {
  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, 'messageCreate');

    this.client = client;
  }

  async run(message: Message): Promise<Message<boolean> | void> {
    const { author, channel } = message;

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