import {
  ApplicationCommandOptionType,
  InteractionReplyOptions,
  PermissionFlagsBits
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

export default class ClearCommand extends CommandBase {
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
  }

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const amountOfMessagesToBeDeleted: number = ctx.interaction.options.getNumber(
      'quantidade', 
      true
    );

    const deletedMessages = await ctx.channel.bulkDelete(amountOfMessagesToBeDeleted, true);
    const totalMessagesDeleted: number = Array.from(deletedMessages).length;

    return ctx.reply({
      ephemeral: true,
      content: `\`${totalMessagesDeleted}\` mensagens foram deletadas deste canal.`
    });
  }
}