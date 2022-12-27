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

import messariClient from '@/src/resources/messari/client';

import { MessariAssetModel } from '@/src/resources/messari/models/asset.model';

import { formatNumber, formatTimestamp, toCurrency } from '@/src/shared/utils/functions';

export default class CryptoCommand extends CommandBase {
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

    const {
      id,
      symbol,
      name,
      rank,
      marketCapDominancePercent,
      currentMarketCapUSD,
      outstandingMarketCapUSD,
      realizedMarketCapUSD,
      priceUSD,
      volumeLast24h,
      realVolumeLast24h,
      percentChangeLast1hUSD,
      percentChangeLast24hUSD,
      lastTradeAt,
      redditActiveUsers,
      redditSubscribers
    }: MessariAssetModel = MessariAssetModel.build({
      data: asset.data
    });

    const lastTradeTimestamp: string = formatTimestamp(lastTradeAt);
    const lastTradeAtTimestamp: string = formatTimestamp(lastTradeAt, 'R');

    const description: string[] = [
      `Este ativo tem **${formatNumber(redditActiveUsers)}** usuários ativos no Reddit e **${formatNumber(redditSubscribers)}** assinantes \n`,
      `» \`Dados\`: `,
      `ㅤ• Preço USD: \`${toCurrency(priceUSD)}\` (Alterou \`${percentChangeLast1hUSD.toFixed(2)}\` em 1h, \`${percentChangeLast24hUSD.toFixed(2)}%\` em 24h)`,
      `ㅤ• Volume nas últimas 24h: **${formatNumber(volumeLast24h)}**`,
      `ㅤ• Volume real: \`${formatNumber(realVolumeLast24h)}\``,
      `ㅤ• Última transação em: ${lastTradeTimestamp} (${lastTradeAtTimestamp})`,
      `» \`Capitalização do mercado\`: `,
      `ㅤ• Rank: :medal: ${rank}`,
      `ㅤ• Dominância: \`${marketCapDominancePercent.toFixed(2)}%\``,
      `ㅤ• Capital atual USD: \`${toCurrency(currentMarketCapUSD)}\``,
      `ㅤ• Capital destaque USD: **${toCurrency(outstandingMarketCapUSD)}**`,
      `ㅤ• Capital realizado USD: \`${toCurrency(realizedMarketCapUSD)}\``
    ];

    const mainEmbed: EmbedBuilder = new this.client.embed(ctx.executor)
      .setAuthor(`[${symbol}] ${name} (${id})`)
      .setDescription(description.join('\n'))
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
          label: name,
          style: ButtonStyle.Secondary,
          disabled: true
        }).build()
      );

    await ctx.reply({ embeds: [mainEmbed], components: [row] });

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 240_000,
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