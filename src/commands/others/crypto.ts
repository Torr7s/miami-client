import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CollectedInteraction,
  ComponentType,
  Interaction,
  InteractionCollector,
  InteractionReplyOptions,
} from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { MessariAllAssets, MessariAssetMetrics } from '@types';
import { MessariAssetMetricsModel, messariRequest } from '@helpers/messari'

import { Embed } from '@shared/builders/embed';

import { toCurrency, format } from '@shared/utils/functions/number';

/**
 * Represents a Crypto slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class CryptoCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs CryptoCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, {
      name: 'cripto',
      description: 'Obter métricas de uma criptomoeda',
      category: 'Others',
      options: [
        {
          name: 'ativo',
          nameLocalizations: {
            'en-US': 'asset'
          },
          description: 'Nome da moeda',
          descriptionLocalizations: {
            'en-US': 'The currency name'
          },
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    });

    this.client = client;
  }

  /**
   * Format an asset percentage accordingly
   * 
   * @param {Number} percent - The asset change percentage
   * 
   * @returns {String} result - The formatted result 
   */
  formatPercent(percent: number): string {
    let result: string = String(percent);
    const fixed: string = percent.toFixed(2);

    if (result.startsWith('-')) result = `<:decline:1011088020302221423> \`${fixed}\``;
    else if (result !== '0') result = `<:growth:1011087978522755162> \`${fixed}\``;
    else result = `\`${fixed}\``

    return result;
  }

  /**
   * Handle the incoming interaction as a command
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {InteractionReplyOptions | void} options - The given options for ctx
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions | void> {
    const option: string = ctx.interaction.options.getString('ativo', true);

    const asset: MessariAssetMetrics = await messariRequest<MessariAssetMetrics>(`v1/assets/${option}/metrics`);

    if (!asset) {
      return ctx.reply({
        ephemeral: true,
        content: `
            Ativo inválido, não foram encontrados resultados. \nVocê pode encontrar todos os ativos **[aqui](https://messari.io/screener/all-assets-D86E0735)**.
          `
      });
    }

    const metrics: MessariAssetMetricsModel = MessariAssetMetricsModel.build(asset);

    const description: string[] = [
      `» \`Dados\`: `,
      `ㅤ• Preço USD: \`${toCurrency(metrics.priceUsd)}\` (Alterou \`${metrics.percentChangeUsdLast24h.toFixed(2)}%\` em 24h)`,
      `ㅤ• Volume nas últimas 24h: ${format(metrics.volumeLast24h)}`,
      `ㅤ• Última transação em: ${metrics.lastTradeAt}`,
      `» \`Capitalização do mercado\`: `,
      `ㅤ• Rank: ${metrics.rank}`,
      `ㅤ• Dominância: \`${metrics.marketCapDominancePercent.toFixed(2)}%\``,
      `ㅤ• Capital atual USD: \`${toCurrency(metrics.currentMarketCapUsd)}\``
    ];

    const mainEmbed: Embed = new this.client.embed(ctx.user, {
      author: {
        name: `
          [${metrics.symbol}] ${metrics.name} (${metrics.id})
        `
      },
      description: description.join('\n')
    });

    const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        /* Go to the next page button */
        new this.client.button({
          custom_id: 'next',
          emoji: {
            name: 'next',
            id: '1011087528612343838',
            animated: false
          },
          label: 'Ativos',
          style: ButtonStyle.Secondary
        }).build(),
        /* Go to the previous page button */
        new this.client.button({
          custom_id: 'previous',
          emoji: {
            name: 'previous',
            id: '1011087460371017818',
            animated: false
          },
          label: `${metrics.name}`,
          style: ButtonStyle.Secondary,
          disabled: true
        }).build()
      );

    await ctx.reply({
      embeds: [mainEmbed],
      components: [
        row
      ]
    });

    const filter = (i: Interaction): boolean => i.user.id === ctx.user.id;

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter
    });

    collector.on('collect', async (target: CollectedInteraction): Promise<void> => {
      if (!target.deferred) await target.deferReply({ ephemeral: true });

      switch (target.customId) {
        case 'next':
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(false);

          const res: MessariAllAssets = await messariRequest<MessariAllAssets>('v2/assets');

          const assetsArr = res.data.slice(0, 9);
          const assetsObj = Object.entries(assetsArr)
            .map(([, asset]) => asset)
            .sort((x, y): number => y.metrics.market_data.price_usd - x.metrics.market_data.price_usd)

          const description: string[] = assetsObj.map((asset, index) => {
            const {
              name,
              metrics: {
                market_data: {
                  price_usd,
                  percent_change_usd_last_24_hours
                }
              }
            } = asset;

            return (
              `\`${index + 1}\`ﾠ-ﾠ**${name}**ﾠ-ﾠ\`${toCurrency(price_usd)}\` (${this.formatPercent(percent_change_usd_last_24_hours)}% em 24h)`
            );
          });

          const embed: Embed = new this.client.embed(ctx.user, {
            title: 'Posição | Ativo | Preço USD',
            author: {
              name: 'Top ativos no momento'
            },
            description: `${description.join('\n')}`
          });

          await ctx.interaction.editReply({
            embeds: [embed],
            components: [
              row
            ]
          });

          break;

        case 'previous':
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(true);
          
          await ctx.interaction.editReply({
            embeds: [mainEmbed],
            components: [
              row
            ]
          });

          break;

        default: break;
      }
    })
  }
}