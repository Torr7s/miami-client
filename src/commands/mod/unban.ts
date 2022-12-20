import {
  ApplicationCommandOptionType,
  codeBlock,
  DiscordAPIError,
  InteractionReplyOptions,
  PermissionFlagsBits,
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

export default class UnbanCommand extends CommandBase {
  public client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'desbanir',
      description: 'Desbanir um usuário do servidor',
      category: 'Mod',
      options: [
        {
          name: 'id',
          description: 'Id do usuário',
          descriptionLocalizations: {
            'en-US': 'Target user id'
          },
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
      permissions: {
        appPerms: [PermissionFlagsBits.BanMembers],
        memberPerms: [PermissionFlagsBits.BanMembers]
      }
    });

    this.client = client;
  }

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions|void> {
    const targetUserId: string = ctx.interaction.options.getString('id', true);

    try {
      await ctx.guild.bans.remove(targetUserId);
      await ctx.reply({
        content: `O usuário <@${targetUserId}> foi desbanido do servidor.`
      });

      /* :..: */

    } catch (error) {
      if ((error as DiscordAPIError).message == 'Unknown User') {
        return ctx.reply({
          ephemeral: true,
          content: `Banimento desconhecido, o id \`${targetUserId}\` não foi encontrado na lista de banimentos do servidor.`
        });      
      }

      return ctx.reply({
        ephemeral: true,
        content: `Erro ao tentar desbanir este usuário: ${codeBlock(error.message!)}`
      });
    }
  }
}