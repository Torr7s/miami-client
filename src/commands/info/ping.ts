import { InteractionReplyOptions } from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

/**
 * Represents a Ping slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class PingCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs PingCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, {
      name: 'ping',
      description: 'Ver a latência do client',
      category: 'Info'    
    });

    this.client = client;
  }

  /**
   * Handle the incoming interaction as a command
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {Promise<InteractionReplyOptions>} options - The given options for ctx
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    return ctx.reply({
      content: `Latência atual do client: \`${this.client.ws.ping}ms\`!`
    });
  }
}