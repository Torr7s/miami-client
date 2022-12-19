import { rastrearEncomendas } from 'correios-brasil';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  codeBlock,
  CollectedInteraction,
  ComponentType,
  Interaction,
  InteractionCollector,
  InteractionReplyOptions
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import { EmbedComponent } from '@/src/shared/components/embed';
import { formatTimestamp } from '@/src/shared/utils/functions';

const wait: any = require('node:timers/promises').setTimeout;

export default class TrackCommand extends CommandBase {
  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'rastreio',
      description: 'Rastrear uma encomenda nos Correios',
      category: 'Others',
      options: [
        {
          name: 'código',
          nameLocalizations: {
            'en-US': 'code'
          },
          description: 'Código de rastreio da encomenda',
          descriptionLocalizations: {
            'en-US': 'Order tracking code'
          },
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    });

    this.client = client;
  }

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions|void> {
    const trackingCode: string = ctx.interaction.options.getString('código', true);

    const orderResponse: OrderResponse[] = await rastrearEncomendas([trackingCode]);

    if (orderResponse[0].mensagem?.startsWith('SRO-020')) {
      return ctx.reply({
        ephemeral: true,
        content: 'Objeto não encontrado na base de dados dos Correios.'
      });
    }

    const mainEmbed: EmbedComponent = new this.client.embed(ctx.user)
      .setAuthor('Rastreio de Encomenda')
      .setThumbnail('https://logospng.org/download/correios/logo-correios-2048.png')
      .setDescription(`
      • Código do objeto: ${orderResponse[0].codObjeto}
      • Modalidade: ${orderResponse[0].modalidade}

      \`Eventos da encomenda disponíveis abaixo, siga com os botões\`
    `);

    const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new this.client.button({
          custom_id: 'next',
          label: '▶️',
          style: ButtonStyle.Secondary
        }).build(),
        new this.client.button({
          custom_id: 'last',
          label: '⏩',
          style: ButtonStyle.Secondary
        }).build(),
        new this.client.button({
          custom_id: 'first',
          label: '⏪',
          style: ButtonStyle.Secondary
        }).build(),
        new this.client.button({
          custom_id: 'previous',
          label: '◀️',
          style: ButtonStyle.Secondary
        }).build()
      );

    await ctx.reply({
      embeds: [mainEmbed.build()],
      components: [row]
    });

    let embedPages: EmbedComponent[] = [];

    const orderEvents: OrderEventsResponse[] = orderResponse[0].eventos;

    for (let i: number = 0; i <= orderEvents.length; i++) {
      const embed: EmbedComponent = new this.client.embed(ctx.user)
        .setAuthor('Eventos da Encomenda')
        .setDescription(codeBlock(orderEvents[i]?.descricao));

      const unitAddress: string = orderEvents[i]?.unidade?.endereco.cidade;
      const targetUnit: string = orderEvents[i]?.unidadeDestino?.endereco.cidade;

      unitAddress && embed.addField(
        'Unidade',
        codeBlock(unitAddress)
      );

      targetUnit && embed.addField(
        'Unidade de Destino',
        codeBlock(targetUnit)
      );

      embed.addField('Data de Criação', formatTimestamp(new Date(orderEvents[i]?.dtHrCriado)));

      embedPages.push(embed);
    }

    embedPages = embedPages.map((page: EmbedComponent, index: number): EmbedComponent =>
      page.setFooter(
        `Página: ${index + 1}/${embedPages.length - 1}`
      )
    ).reverse();

    let currentPage: number = 0;

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      filter: (i: Interaction): boolean => i.user.id === ctx.user.id,
      componentType: ComponentType.Button
    });

    collector.on('collect', async (target: CollectedInteraction): Promise<void> => {
      !target.deferred && target.deferUpdate().catch((): void => {});

      await wait(2000);

      switch (target.customId) {
        /**
         * Move to the next page of events
         * ▶️
         */
        case 'next':
          if (currentPage < embedPages.length - 1) {
            currentPage++;

            await target.editReply({
              embeds: [embedPages[currentPage].build()],
              components: [row]
            });
          }

          break;

        /**
         * Move to the last page of events
         * ⏩
         */
        case 'last':
          currentPage = embedPages.length - 1;

          await target.editReply({
            embeds: [embedPages[currentPage].build()],
            components: [row]
          });

          break;

        /**
         * Move to the first page of events
         * ⏪
         */
        case 'first':
          if (currentPage != 0) {
            currentPage = 1;

            await target.editReply({
              embeds: [embedPages[currentPage].build()],
              components: [row]
            });
          }

          break;

        /**
         * Move to the previous page of events
         * ◀️
         */
        case 'previous':
          if (currentPage - embedPages.length) {
            currentPage = embedPages.length - 1;

            await target.editReply({
              embeds: [embedPages[currentPage].build()],
              components: [row]
            });
          }

          break;
          
        default: break;
      }
    });

    collector.on('end', async (): Promise<void> => {
      row.components.forEach((component) => component.setDisabled(true));

      await ctx.interaction.editReply({
        embeds: [embedPages[currentPage].build()],
        components: [row]
      });
    });
  }
}

interface OrderResponse {
  codObjeto: string;
  eventos: OrderEventsResponse[];
  modalidade: string;
  tipoPostal: {
    categoria: string;
    descricao: string;
    sigla: string;
  };
  mensagem?: string;
}

interface OrderEventsResponse {
  codigo: string;
  descricao: string;
  dtHrCriado: string;
  tipo: string;
  unidade: OrderEventUnitResponse;
  unidadeDestino?: OrderEventUnitResponse;
  urlIcone: string;
}

interface OrderEventUnitResponse {
  endereco: {
    cidade: string;
    uf: string;
  };
  tipo: string;
}