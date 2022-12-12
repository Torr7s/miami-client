import {
  ApplicationCommandOptionType,
  DMChannel,
  EmbedBuilder,
  GuildMember,
  InteractionReplyOptions,
  PermissionFlagsBits,
  Role,
  User
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

export default class BanCommand extends CommandBase {
  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'banir',
      description: 'Banir um usuário do servidor',
      category: 'Mod',
      options: [
        {
          name: 'usuário',
          nameLocalizations: {
            'en-US': 'user'
          },
          description: 'Usuário à ser banido',
          descriptionLocalizations: {
            'en-US': 'Target user'
          },
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'motivo',
          nameLocalizations: {
            'en-US': 'reason'
          },
          description: 'Motivo do banimento',
          descriptionLocalizations: {
            'en-US': 'Ban reason'
          },
          type: ApplicationCommandOptionType.String
        },
        {
          name: 'dias',
          nameLocalizations: {
            'en-US': 'days'
          },
          description: 'Número de dias de mensagens para apagar',
          descriptionLocalizations: {
            'en-US': 'Number of days of messages to delete'
          },
          minValue: 0,
          maxValue: 7,
          type: ApplicationCommandOptionType.Number
        }
      ],
      permissions: {
        appPerms: [PermissionFlagsBits.BanMembers],
        memberPerms: [PermissionFlagsBits.BanMembers]
      }
    });

    this.client = client;
  }

  async run(ctx: CommandContext): Promise<InteractionReplyOptions | void> {
    const targetUser: User = ctx.resolvedUsers[0];
    const targetMember: GuildMember = ctx.guild.members.cache.get(targetUser.id);

    if (targetMember) {
      if ([this.client.user.id, ctx.guild.ownerId].includes(targetMember.id)) {
        return ctx.reply({
          ephemeral: true,
          content: `
            Não posso banir à mim mesmo ou o dono do servidor.
          `
        });
      }
    }

    const clientHighestRole: Role = ctx.guild.members.cache.get(this.client.user.id)?.roles?.highest;

    if (targetMember.roles?.highest.position >= clientHighestRole.position) {
      return ctx.reply({
        ephemeral: true,
        content: `
          Não posso banir membros que tenham cargos superiores ao meu.
        `
      });
    }

    const member: GuildMember = ctx.guild.members.cache.get(ctx.user.id);

    if (ctx.user.id !== ctx.guild.ownerId) {
      if (targetMember.roles?.highest.position >= member.roles?.highest.position) {
        return ctx.reply({
          ephemeral: true,
          content: `
            O cargo deste membro é superior ao seu, portanto, você não pode bani-lo.
          `
        });
      }
    }

    const deleteMessageDays: number = ctx.interaction.options.getNumber('days');
    const reason: string = ctx.interaction.options.getString('reason') ?? 'Motivo não definido';

    const embed: EmbedBuilder = new this.client.embed(targetUser)
      .setAuthor('Banido do servidor')
      .setDescription(`Você foi banido do servidor \`${ctx.guild.name}\``)
      .setThumbnail(`${ctx.guild.iconURL()}`)
      .addField('Autor', `${ctx.user.tag}`)
      .addField('Motivo', `\`${reason}\``)
      .build();

    try {
      const dm: DMChannel = await targetUser.createDM();
      await dm.send({
        embeds: [
          embed
        ]
      });

    } catch (error) {
      if (targetUser.dmChannel) await targetUser.deleteDM();
    }

    ctx.guild.bans.create(targetUser, { deleteMessageDays, reason }).then((): void => {
      ctx.reply({
        content: `
          \`${targetUser.tag}\` foi banido do servidor por \`${reason}\`
        `
      });
    })
      .catch((_: any): any => {
        ctx.reply({
          content: `Não foi possível banir este membro do servidor.`
        });
      });
  }
}