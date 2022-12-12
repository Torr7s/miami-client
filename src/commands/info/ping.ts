import { InteractionReplyOptions } from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

export default class PingCommand extends CommandBase {
  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'ping',
      description: 'Ver a latência do client',
      category: 'Info'    
    });

    this.client = client;
  }

  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    return ctx.reply({
      content: `Latência atual do client: \`${this.client.ws.ping}ms\`!`
    });
  }
}