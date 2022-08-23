import {
  APIInteractionDataResolvedChannel,
  ApplicationCommandOptionType,
  Channel,
  GuildBasedChannel,
  InteractionReplyOptions
} from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { Embed } from '@shared/builders/embed';

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

    const channelCreatedAt: number = ~~(+channel.createdAt / 1e3);

    const embed: Embed = new this.client.embed(ctx.user, {
      author: {
        name: `
          Informações de canal: # ${channel.name.toUpperCase()}
        `
      },
      thumbnail: {
        url: ctx.guild.iconURL()
      },
      fields: [
        {
          name: ':id: ID',
          value: `${channel.id}`,
          inline: true
        },
        {
          name: ':date: Data de criação',
          value: `<t:${channelCreatedAt}:d> <t:${channelCreatedAt}:R>`,
          inline: true
        },
        {
          name: ':knot: Tipo',
          value: `${channelTypes[channel.type]}`,
          inline: true
        }
      ]
    });

    if (channel.type === 0) {
      embed.addFields([
        {
          name: ':no_entry_sign: NSFW',
          value: `${channel.nsfw ? 'Sim' : 'Não'}`,
          inline: true
        },
        {
          name: ':first_place: Posição',
          value: `${channel.position}º lugar`,
          inline: true
        }
      ]);
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

      embed.addFields([
        {
          name: ':zap:Taxa de bits',
          value: `${channel.bitrate}`,
          inline: true
        },
        {
          name: ':busts_in_silhouette: Membros agora',
          value: `${channel.members.size}/${channel.userLimit}`,
          inline: true
        },
        {
          name: ':map: Região',
          value: `${voiceRegions[channel.rtcRegion] ?? 'Auto'}`,
          inline: true
        }
      ]);
    }

    return ctx.reply({
      embeds: [
        embed
      ]
    });
  }
}