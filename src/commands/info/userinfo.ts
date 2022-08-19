import { ApplicationCommandOptionType, ClientPresenceStatus, GuildMember, InteractionReplyOptions, PresenceStatus, User } from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { Embed } from '@shared/builders/embed';

import { resolveFlags } from '@shared/utils/discord/resolvables/flags';

/**
 * Represents a UserInfo slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class UserInfo extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs UserInfo
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, {
      name: 'userinfo',
      description: 'Ver informações de um usuário',
      category: 'Info',
      options: [
        {
          name: 'usuário',
          nameLocalizations: {
            'en-US': 'user'
          },
          description: 'Usuário desejado',
          descriptionLocalizations: {
            'en-US': 'Desired user'
          },
          type: ApplicationCommandOptionType.User,
          required: true
        }
      ]
    });

    this.client = client;
  }

  getStatus(status: string | null): string {
    const statuses = {
      online: 'Online',
      dnd: 'Não Perturbe',
      idle: 'Ausente',
    }

    return statuses[status];
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
    const user: User = ctx.resolvedUsers[0];

    const userCreatedAt: number = ~~(+user.createdAt / 1e3);

    const embed: Embed = new this.client.embed(ctx.user, {
      title: `Informações de ${user.tag}`,
      thumbnail: {
        url: user.avatarURL()
      },
      fields: [
        {
          name: ':id: ID',
          value: `${user.id}`,
          inline: true
        },
        {
          name: ':date: Conta criada em',
          value: `<t:${userCreatedAt}:d> <t:${userCreatedAt}:R>`,
          inline: true
        }
      ]
    });

    const member: GuildMember = ctx.guild.members.cache.get(user.id);

    if (member) {
      embed.addFields([
        {
          name: ':dart: Status',
          value: `${this.getStatus(member.presence?.status) ?? 'Offline'}`
        }
      ]);
    }

    const { flags } = resolveFlags(user.flags);

    if (flags) {
      embed.addFields([
        {
          name: `:triangular_flag_on_post: Flags`,
          value: `${flags}`
        }
      ]);
    }

    return ctx.reply({ embeds: [embed] });
  }
}