import {
  ApplicationCommandOptionType,
  DMChannel,
  PermissionFlagsBits,
  User
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

export default class UnbanCommand extends CommandBase {
  client: MiamiClient;

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

  async run(ctx: CommandContext): Promise<void> {
    const targetUserId: string = ctx.interaction.options.getString('id');

    const targetUser: User = this.client.users.cache.get(targetUserId);

    try {
      const dm: DMChannel = targetUser && await targetUser?.createDM();
      await dm?.send({
        content: `Você foi desbanido do servidor \`${ctx.guild.name}\` por \`${ctx.user.tag}\`.`
      });
    } catch (error) {
      if (targetUser && targetUser.dmChannel) await targetUser.deleteDM();
    }

    ctx.guild.bans.remove(targetUserId)
      .then(async (): Promise<void> => {
        await ctx.reply({
          content: `O usuário <@${targetUserId}> foi desbanido do servidor.`
        });
      })
      .catch(async (): Promise<void> => {
        await ctx.reply({
          ephemeral: true,
          content: `Banimento desconhecido, o id \`${targetUserId}\` não foi encontrado.`
        });
      });
  }
}