import config from 'config';

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

import { MessariAssetMetrics, MessariClient, QueryResult } from '@torr7s/messari-client';

import { MessariAssetModel } from '@/src/resources/messari/asset.model';
import { MessariConfigProps } from '@/config/default';

import { toCurrency, formatNumber, formatTimestamp } from '@/src/shared/utils/functions';

const messariConfig: MessariConfigProps = config.get<
  MessariConfigProps
>('app.resources.messari');

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

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions|void> {
    const messariClient = new MessariClient(messariConfig.apiKey);

    const assetIdentifier: string = ctx.interaction.options.getString('ativo', true);
    const asset = await messariClient.getAssetMetrics(assetIdentifier);

    if (asset.status.error_message) {
      const error: string = asset.status.error_message;

      if (error === 'Asset not found') {
        const assets: string = 'https://messari.io/screener/all-assets-D86E0735';
        const content: string = `Um erro foi encontrado durante a busca: "Ativo não encontrado"! \n\nDica: **[Lista](${assets})** de todos os ativos disponíveis.`

        return ctx.reply({
          ephemeral: true,
          content
        });
      }

      return ctx.reply({ ephemeral: true, content: error });
    }

    const assetModel: MessariAssetModel = MessariAssetModel.build(asset.data);

    const lastTrade: string = formatTimestamp(assetModel.lastTradeAt);
    const lastTradeAt: string = formatTimestamp(assetModel.lastTradeAt, 'R');

    const description: string[] = [
      `» \`Dados\`: `,
      `ㅤ• Preço USD: \`${toCurrency(assetModel.priceUsd)}\` (Alterou \`${assetModel.percentChangeUsdLast24h.toFixed(2)}%\` em 24h)`,
      `ㅤ• Volume nas últimas 24h: ${formatNumber(assetModel.volumeLast24h)}`,
      `ㅤ• Última transação em: ${lastTrade} (${lastTradeAt})`,
      `» \`Capitalização do mercado\`: `,
      `ㅤ• Rank: ${assetModel.rank}`,
      `ㅤ• Dominância: \`${assetModel.marketCapDominancePercent.toFixed(2)}%\``,
      `ㅤ• Capital atual USD: \`${toCurrency(assetModel.currentMarketCapUsd)}\``
    ];

    const mainEmbed: EmbedBuilder = new this.client.embed(ctx.executor)
      .setAuthor(`[${assetModel.symbol}] ${assetModel.name} (${assetModel.id})`)
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
          label: `${assetModel.name}`,
          style: ButtonStyle.Secondary,
          disabled: true
        }).build()
      );

    await ctx.reply({ embeds: [mainEmbed], components: [row] });

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 45000,
      filter: (i: Interaction): boolean => i.user.id === ctx.executor.id
    });

    collector.on('collect', async (target: CollectedInteraction): Promise<void> => {
      await this.client.utils.handleUndeferredInteraction(target);

      switch (target.customId) {
        case 'next':
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(false);

          const allAssets = await messariClient.listAllAssets();

          const allAssetsCopyArray = allAssets.data.slice(0, 9);
          const sortedAssets = Object.entries(allAssetsCopyArray)
            .map(([, asset]) => asset)
            .sort((x, y): number => y.metrics.market_data.price_usd - x.metrics.market_data.price_usd);

          const description: string[] = sortedAssets.map((asset, index: number): string => {
            const { name, metrics: { market_data } } = asset;

            return (
              `\`${index + 1}\`ﾠ-ﾠ**${name}**ﾠ-ﾠ\`${toCurrency(market_data.price_usd)}\` (${this.formatPercent(market_data.percent_change_usd_last_24_hours)}% em 24h)`
            );
          });

          const embed: EmbedBuilder = new this.client.embed(ctx.executor)
            .setTitle('Posição | Ativo | Preço USD')
            .setAuthor('Top ativos no momento')
            .setDescription(description.join('\n'))
            .build();

          await target.editReply({ embeds: [embed], components: [row] });

          break;
        case 'previous':
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(true);

          await target.editReply({ embeds: [mainEmbed], components: [row] });

          break;
        default: break;
      }
    });

    collector.on('end', async (): Promise<void> => {
      await ctx.interaction.deleteReply();
    });
  }
}