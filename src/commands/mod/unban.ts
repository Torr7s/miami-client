import {
  ApplicationCommandOptionType,
  DMChannel,
  PermissionFlagsBits,
  User
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

/**
 * Represents a Unban slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class UnbanCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs UnbanCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
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

  /**
   * Handle the incoming interaction as a command
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {Promise<void>} void
   */
  async run(ctx: CommandContext): Promise<void> {
    const targetUserId: string = ctx.interaction.options.getString('id');
    
    const targetUser: User = this.client.users.cache.get(targetUserId);

    try {
      const dm: DMChannel = targetUser && await targetUser?.createDM();
      await dm?.send({
        content: `
          Você foi desbanido do servidor \`${ctx.guild.name}\` por \`${ctx.user.tag}\`.
        `
      });

    } catch (error) {
      if (targetUser && targetUser.dmChannel) await targetUser.deleteDM();
    }

    ctx.guild.bans.remove(targetUserId).then((): void => {
      ctx.reply({
        content: `O usuário <@${targetUserId}> foi desbanido do servidor.`
      });
    }).catch((_: any): void => {
      ctx.reply({
        ephemeral: true,
        content: `
          Banimento desconhecido, o id \`${targetUserId}\` não foi encontrado.
        `
      });
    });
  }
}