import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CollectedInteraction,
  ComponentType,
  EmbedBuilder,
  Interaction,
  InteractionCollector,
  InteractionReplyOptions
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import { MessariAllAssets, MessariAssetMetrics } from '@/src/typings';
import { MessariRequester } from '@/src/resources/messari/requester';
import { MessariAssetMetricsModel } from '@/src/resources/messari/assets/metrics.model';

import { toCurrency, formatNumber, formatTimestamp } from '@/src/shared/utils/functions';

const messariRequestHandler = new MessariRequester();

export default class CryptoCommand extends CommandBase {
  public client: MiamiClient;

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
      ],
      cooldown: 5
    });

    this.client = client;
  }

  private formatPercent(percent: number): string {
    let result: string = String(percent);
    const fixed: string = percent.toFixed(2);

    if (result.startsWith('-')) result = `<:decline:1011088020302221423> \`${fixed}\``;
    else if (result !== '0') result = `<:growth:1011087978522755162> \`${fixed}\``;
    else result = `\`${fixed}\``

    return result;
  }

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions | void> {
    const option: string = ctx.interaction.options.getString('ativo', true);

    const asset: MessariAssetMetrics = await messariRequestHandler.get<
      MessariAssetMetrics
    >(`v1/assets/${option}/metrics`);

    if (!asset.data) {
      return ctx.reply({
        ephemeral: true,
        content: 'Ativo inválido, não foram encontrados resultados. \nVocê pode encontrar todos os ativos **[aqui](https://messari.io/screener/all-assets-D86E0735)**.'
      });
    }

    const metrics: MessariAssetMetricsModel = MessariAssetMetricsModel.build(asset);

    const lastTrade: string = formatTimestamp(metrics.lastTradeAt);
    const lastTradeAt: string = formatTimestamp(metrics.lastTradeAt, 'R');

    const description: string[] = [
      `» \`Dados\`: `,
      `ㅤ• Preço USD: \`${toCurrency(metrics.priceUsd)}\` (Alterou \`${metrics.percentChangeUsdLast24h.toFixed(2)}%\` em 24h)`,
      `ㅤ• Volume nas últimas 24h: ${formatNumber(metrics.volumeLast24h)}`,
      `ㅤ• Última transação em: ${lastTrade} (${lastTradeAt})`,
      `» \`Capitalização do mercado\`: `,
      `ㅤ• Rank: ${metrics.rank}`,
      `ㅤ• Dominância: \`${metrics.marketCapDominancePercent.toFixed(2)}%\``,
      `ㅤ• Capital atual USD: \`${toCurrency(metrics.currentMarketCapUsd)}\``
    ];

    const mainEmbed: EmbedBuilder = new this.client.embed(ctx.user)
      .setAuthor(`[${metrics.symbol}] ${metrics.name} (${metrics.id})`)
      .setDescription(`${description.join('\n')}`)
      .build();

    const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new this.client.button({
          custom_id: 'next',
          emoji: {
            name: 'next',
            id: '1011087528612343838',
            animated: false
          },
          label: 'Top Ativos',
          style: ButtonStyle.Secondary
        }).build(),
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
      components: [row]
    });

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 45000,
      filter: (i: Interaction): boolean => i.user.id === ctx.user.id
    });

    collector.on('collect', async (target: CollectedInteraction): Promise<void> => {
      !target.deferred && target.deferUpdate().catch((): void => {});

      switch (target.customId) {
        case 'next':
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(false);

          const res: MessariAllAssets = await messariRequestHandler.get<MessariAllAssets>('v2/assets');

          const assetsArr = res.data.slice(0, 9);
          const assetsObj = Object.entries(assetsArr)
            .map(([, asset]) => asset)
            .sort((x, y): number => y.metrics.market_data.price_usd - x.metrics.market_data.price_usd)

          const description: string[] = assetsObj.map((asset, index: number): string => {
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

          const embed: EmbedBuilder = new this.client.embed(ctx.user)
            .setTitle('Posição | Ativo | Preço USD')
            .setAuthor('Top ativos no momento')
            .setDescription(`${description.join('\n')}`)
            .build();

          await target.editReply({
            embeds: [embed],
            components: [row]
          });

          break;

        case 'previous':
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(true);

          await target.editReply({
            embeds: [mainEmbed],
            components: [row]
          });

          break;
        default: break;
      }
    });

    collector.on('end', async (): Promise<void> => {
      await ctx.interaction.deleteReply();
    });
  }
}

