import {
  ApplicationCommandOptionType,
  Collection,
  InteractionReplyOptions,
  Message,
  PartialMessage,
  PermissionFlagsBits
} from 'discord.js';

import CommandBase from '@structures/command';
import CommandContext from '@structures/commandContext';
import MiamiClient from '@structures/client';

/**
 * Represents a Clear slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class ClearCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs ClearCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, {
      name: 'limpar',
      description: 'Limpar até 100 mensagens do canal',
      category: 'Mod',
      options: [
        {
          name: 'quantidade',
          nameLocalizations: {
            'en-US': 'amount'
          },
          description: 'Quantidade de mensagens à serem limpas',
          descriptionLocalizations: {
            'en-US': 'Message quantity to be cleaned'
          },
          minValue: 1,
          maxValue: 100,
          required: true,
          type: ApplicationCommandOptionType.Number
        }
      ],
      permissions: {
        appPerms: [PermissionFlagsBits.ManageMessages],
        memberPerms: [PermissionFlagsBits.ManageMessages]
      }
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
   * @returns {InteractionReplyOptions} options - The given options for ctx
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const amount: number = ctx.interaction.options.getNumber('quantidade', true);

    const messages: Collection<string, Message<boolean> | PartialMessage> = await ctx.channel.bulkDelete(amount, true);
    const totalCleaned: number = Array.from(messages).length;

    return ctx.reply({
      ephemeral: true,
      content: `\`${totalCleaned}\` mensagens foram deletadas deste canal.`
    });
  }
}