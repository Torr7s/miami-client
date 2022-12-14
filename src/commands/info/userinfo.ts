import { 
  ApplicationCommandOptionType, 
  GuildMember, 
  InteractionReplyOptions, 
  User 
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import EmbedComponent from '@/src/shared/components/embed';

import { resolveFlags } from '@/src/shared/utils/discord/resolvables/flags';
import { formatTimestamp } from '@/src/shared/utils/functions';

export default class UserInfoCommand extends CommandBase {
  constructor(client: MiamiClient) {
    super(client, {
      name: 'usuário',
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
            'en-US': 'Target user'
          },
          type: ApplicationCommandOptionType.User,
          required: true
        }
      ]
    });
  }

  getStatus(status: string): string {
    const statuses: { [status: string]: string } = {
      online: 'Online',
      dnd: 'Não Perturbe',
      idle: 'Ausente',
    }

    return statuses[status];
  }

  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const user: User = ctx.resolvedUsers[0];

    const embed: EmbedComponent = new this.client.embed(ctx.executor)
      .setAuthor(`Informações de ${user.tag}`)
      .setDescription(`• Conta criada em ${formatTimestamp(user.createdAt, 'D')} (${formatTimestamp(user.createdAt, 'R')})`)
      .setThumbnail(`${user.displayAvatarURL()}`)
      .addField(':id: ID', `${user.id}`);

    const member: GuildMember = ctx.guild.members.cache.get(user.id);

    if (member) {
      const memberStatus: string = this.getStatus(member.presence?.status) ?? 'Offline'

      embed.addField(':dart: Status', `${memberStatus}`);
    }

    const { flags } = resolveFlags(user.flags);

    if (flags) {
      embed.addField(
        ':triangular_flag_on_post: Flags',
        flags
      );
    }

    return ctx.reply({ embeds: [embed.build()] });
  }
}