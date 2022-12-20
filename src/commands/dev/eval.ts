import util from 'node:util';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  codeBlock,
  CollectedInteraction,
  ComponentType,
  Interaction,
  InteractionCollector,
  User
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import { Logger } from '@/src/shared/utils/logger';

export default class EvalCommand extends CommandBase {
  public client: MiamiClient;
  private readonly logger: Logger;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'eval',
      description: 'Executar um código em javascript',
      category: 'Dev',
      restricted: true,
      options: [
        {
          name: 'código',
          description: 'Código a ser executado',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'efêmero',
          description: 'Enviar resposta em modo efêmero',
          type: ApplicationCommandOptionType.Boolean,
          required: false
        }
      ]
    });

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }

  private format(text: string): string {
    if (typeof text === 'string') {
      text
        .slice(0, 3000)
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`)
        .replace(new RegExp(process.env.TOKEN, 'gi'), '****');
    }

    return text;
  }

  public async run(ctx: CommandContext): Promise<void> {
    const codeToBeEvalued: string = ctx.interaction.options.getString('código', true);
    const isEphemeral: boolean = ctx.interaction.options.getBoolean('efêmero');

    let resultFromEval: string;

    try {
      const evalued: any = await eval(codeToBeEvalued);

      resultFromEval = this.format(
        util.inspect(evalued, {
          depth: 0
        })
      );
    } catch (error) {
      this.logger.error('An error has been found: ', error);

      resultFromEval = error.message!;
    }

    const code: string = codeBlock(resultFromEval);

    const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new this.client.button({
          custom_id: 'trash',
          emoji: {
            name: 'trashcan',
            id: '1002227364975083561',
            animated: false
          },
          label: 'Delete',
          style: ButtonStyle.Danger
        }).build()
      );

    if (resultFromEval.length <= 3000) {
      if (isEphemeral) {
        await ctx.reply({
          content: code,
          components: [row],
          ephemeral: true
        });
      }

      await ctx.reply({ content: code, components: [row] });
      
    } else {
      this.logger.info('Result from an eval: ', resultFromEval);

      await ctx.reply({
        ephemeral: true,
        content: 'O resultado foi enviado diretamente para o painel.'
      });
    }

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 45000,
      filter: (i: Interaction): boolean => i.user.id === this.client.config.ownerId
    });

    collector.on('collect', async (target: CollectedInteraction<CacheType>): Promise<void> => {
      if (!target.deferred) await target.deferReply();

      switch (target.customId) {
        case 'trash':
          await ctx.interaction.deleteReply();

          break;
        default: break;
      }
    });

    collector.on('end', async (): Promise<void> => {
      await ctx.interaction.deleteReply();
    });
  }
}