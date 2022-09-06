import {
  APIInteractionDataResolvedChannel,
  ApplicationCommandOptionType,
  Channel,
  GuildBasedChannel,
  InteractionReplyOptions
} from 'discord.js';

import CommandBase from '@structures/command';
import CommandContext from '@structures/commandContext';
import MiamiClient from '@structures/client';

import { formatTimestamp } from '@shared/utils/functions';

/**
 * Represents a Channelinfo slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class ChannelinfoCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs ChannelinfoCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
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

    this.client = client;
  }

  /**
   * Handle the incoming interaction as a command
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {Promise<InteractionReplyOptions>} options - The given options for ctx
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const channelOption: Channel | APIInteractionDataResolvedChannel = ctx.resolvedChannels[0];
    const channel: GuildBasedChannel = ctx.guild.channels.cache.get(channelOption.id);

    const channelTypes: { [type: number]: string } = {
      0: 'Canal de Texto',
      1: 'Mensagem Direta',
      2: 'Canal de Voz',
      3: 'Grupo Privado',
      4: 'Categoria de Canais',
      5: 'Canal de Anúncios',
      10: 'Tópico de Anúncios',
      11: 'Tópico Público',
      12: 'Tópico Privado',
      13: 'Palco de Eventos com Audiência',
      14: 'GUILD_DIRECTORY',
      15: 'Fórum'
    }

    const embed = new this.client.embed(ctx.user)
      .setAuthor(`Informações de canal: # ${channel.name.toUpperCase()}`)
      .setDescription(`• Canal criado em ${formatTimestamp(channel.createdAt, 'D')} (${formatTimestamp(channel.createdAt, 'R')})`)
      .setThumbnail(`${ctx.guild.iconURL()}`)
      .addField(':id: ID', `${channel.id}`)
      .addField(':knot: Tipo', `${channelTypes[channel.type]}`)

    if (channel.type === 0) {
      embed.addField(':no_entry_sign: NSFW', `${channel.nsfw ? 'Sim' : 'Não'}`)
      embed.addField(':first_place: Posição', `${channel.position}º lugar`)
    }

    if (channel.type === 2 || channel.type === 13) {
      const voiceRegions: { [region: string]: string } = {
        'brazil': 'Brasil',
        'hongkong': 'Hong Kong',
        'india': 'Índia',
        'japan': 'Japão',
        'rotterdam': 'Rotterdam',
        'russia': 'Russia',
        'singapore': 'Singapura',
        'southafrica': 'África do Sul',
        'sydney': 'Sidney',
        'us-central': 'América Central',
        'us-east': 'América Oriental',
        'us-south': 'América do Sul',
        'us-west': 'América Ocidental'
      }

      embed.addField(':zap: Taxa de bits', `${channel.bitrate}`)
      embed.addField(':busts_in_silhouette: Membros agora', `${channel.members.size}/${channel.userLimit}`)
      embed.addField(':map: Região', `${voiceRegions[channel.rtcRegion] ?? 'Auto'}`)
    }
    
    return ctx.reply({
      embeds: [
        embed.build()
      ]
    });
  }
}