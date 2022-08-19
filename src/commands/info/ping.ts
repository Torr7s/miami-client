import { InteractionReplyOptions } from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

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
   * Used to handle the incoming interaction
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