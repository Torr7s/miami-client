import { ApplicationCommandOptionType, InteractionReplyOptions } from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { MessariAssetMetrics } from '@types';
import { MessariAssetMetricsModel, getAssetMetrics } from 'helpers/messari';

import { Embed } from '@shared/builders/embed';

import { toCurrency, format } from '@shared/utils/functions/number';

/**
 * Represents a Crypto slash command
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class CryptoCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs RequestCommand
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
            "en-US": 'asset'
          },
          description: 'Nome da moeda',
          descriptionLocalizations: {
            "en-US": 'The currency name'
          },
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    });

    this.client = client;
  }

  /**
   * Used to handle the incoming interaction
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {void} void
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions | void> {
    const option: string = ctx.interaction.options.getString('ativo', true);

    const asset: MessariAssetMetrics = await getAssetMetrics(option);

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
      `<:crypt:1009844607124770906> Dados: `,
      `ㅤ• Preço USD: \`${toCurrency(metrics.priceUsd)}\` (Alterou \`${metrics.percentChangeUsdLast24h.toFixed(2)}%\` em 24h)`,
      `ㅤ• Volume nas últimas 24h: ${format(metrics.volumeLast24h)}`,
      `ㅤ• Última transação em: ${metrics.lastTradeAt}`,
      `<:crypt:1009844607124770906> Capitalização do mercado: `,
      `ㅤ• Rank: ${metrics.rank}`,
      `ㅤ• Dominância: \`${metrics.marketCapDominancePercent.toFixed(2)}%\``,
      `ㅤ• Capital atual USD: \`${toCurrency(metrics.currentMarketCapUsd)}\``
    ];

    const embed: Embed = new this.client.embed(ctx.user, {
      author: {
        name: `[${metrics.symbol}] ${metrics.name} (${metrics.id})`,
        url: this.client.user.displayAvatarURL()
      },
      description: description.join('\n')
    });

    return ctx.reply({ embeds: [embed] });
  }
}