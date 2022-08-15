import { CommandBase } from '@structures/command';
import { CommandContext } from '@structures/commandContext';

import { MiamiClient } from '@structures/client';

/**
 * Represents a Ping slash command
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
   * @returns {void} void
   */
  async run(ctx: CommandContext): Promise<void> {
    await ctx.reply({
      content: `Latência atual do client: \`${this.client.ws.ping}ms\`!`
    });
  }
}