import {
  ApplicationCommandOptionType,
  BanOptions,
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
  public client: MiamiClient;

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

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions | void> {
    const targetUser: User = ctx.resolvedUsers[0];
    const targetMember: GuildMember = ctx.guild.members.cache.get(targetUser.id);

    const member: GuildMember = ctx.guild.members.cache.get(ctx.user.id);

    if (targetMember) {
      const memberHighestRole: number = member?.roles?.highest.position;
      const targetMemberHighestRole: number = targetMember.roles?.highest.position;
      const clientMemberHighestRole: number = ctx.guild.members.cache.get(this.client.user.id)?.roles?.highest.position;

      if ([this.client.user.id, ctx.guild.ownerId].includes(targetMember.id)) {
        return ctx.reply({
          ephemeral: true,
          content: 'Não posso banir à mim mesmo ou ao dono do servidor.'
        });
      }

      if (targetMemberHighestRole >= clientMemberHighestRole) {
        return ctx.reply({
          ephemeral: true,
          content: 'Não posso banir membros que tenham cargos superiores ao meu.'
        });
      }

      if (ctx.user.id !== ctx.guild.ownerId) {
        if (targetMemberHighestRole >= memberHighestRole) {
          return ctx.reply({
            ephemeral: true,
            content: 'O cargo deste membro é superior ou equivalente ao seu, portanto, você não pode bani-lo.'
          });
        }
      }
    }

    const deleteMessageDays: number = ctx.interaction.options.getNumber('days') ?? 0;
    const reason: string = ctx.interaction.options.getString('reason') ?? 'Motivo não definido';

    const daysInSeconds = {
      0: 0,
      1: 86_400,
      2: 172_800,
      3: 259_200,
      4: 345_600,
      5: 432_000,
      6: 518_400,
      7: 604_800
    }

    const embed: EmbedBuilder = new this.client.embed(targetUser)
      .setAuthor('Banido do servidor')
      .setDescription(`Você foi banido do servidor \`${ctx.guild.name}\``)
      .setThumbnail(`${ctx.guild.iconURL()}`)
      .addField('Autor', `${ctx.user.tag}`)
      .addField('Motivo', `\`${reason}\``)
      .build();

    try {
      const dm: DMChannel = await targetUser.createDM();
      await dm.send({ embeds: [embed] });

    } catch (error) {
      if (targetUser.dmChannel) await targetUser.deleteDM();
    }

    const banOptions: BanOptions = {
      deleteMessageSeconds: daysInSeconds[deleteMessageDays],
      reason
    }

    ctx.guild.bans.create(targetUser, banOptions).then(async (): Promise<void> => {
      const content: string = `\`${targetUser.tag}\` foi banido do servidor por \`${reason}\``;

      await ctx.reply({
        content
      });

      // ...
    }).catch(async (): Promise<void> => {
      await ctx.reply({
        ephemeral: true,
        content: `Não foi possível banir este membro do servidor.`
      });
    });
  }
}