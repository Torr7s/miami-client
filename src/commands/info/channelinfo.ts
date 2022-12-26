import {
  ApplicationCommandOptionType,
  codeBlock,
  GuildBasedChannel,
  InteractionReplyOptions
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import EmbedComponent from '@/src/shared/components/embed';

import channelTypesJson from '@/src/shared/utils/json/channels.json';
import rtcRegionsJson from '@/src/shared/utils/json/rtc-regions.json';

import { formatTimestamp } from '@/src/shared/utils/functions';

export default class ChannelinfoCommand extends CommandBase {
  constructor(client: MiamiClient) {
    super(client, {
      name: 'canal',
      description: 'Ver informações de um canal',
      category: 'Info',
      options: [
        {
          name: 'canal',
          nameLocalizations: {
            'en-US': 'channel'
          },
          description: 'Canal desejado',
          descriptionLocalizations: {
            'en-US': 'Target channel'
          },
          type: ApplicationCommandOptionType.Channel,
          required: true
        }
      ]
    });
  }

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const channel: GuildBasedChannel = ctx.guild.channels.cache.get(
      ctx.resolvedChannels[0].id
    );

    const embed: EmbedComponent = new this.client.embed(ctx.executor)
      .setAuthor(`Informações de canal: # ${channel.name.toUpperCase()}`)
      .addField(':id: Identificador', codeBlock(channel.id))
      .addField(':knot: Tipo', channelTypesJson[channel.type])
      .addField(':date: Data de criação', formatTimestamp(channel.createdAt));

    if (channel.type === 0) {
      embed.addField(':no_entry_sign: NSFW', `${channel.nsfw ? 'Sim' : 'Não'}`)
      embed.addField(':first_place: Posição', `${channel.position}º lugar`)
    }

    if (channel.type === 2 || channel.type === 13) {
      const connectedMembers: string = `${channel.members.size}/${channel.userLimit}`;
      const channelRtcRegion: string = rtcRegionsJson[channel.rtcRegion] ?? 'Auto';

      embed.addField(':zap: Taxa de bits', channel.bitrate.toString())
      embed.addField(':busts_in_silhouette: Membros agora', connectedMembers)
      embed.addField(':map: Região', channelRtcRegion);
    }

    return ctx.reply({ embeds: [embed.build()] });
  }
}