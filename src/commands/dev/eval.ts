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
  private readonly logger: Logger;

  client: MiamiClient;

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
        }
      ]
    });

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }
  async run(ctx: CommandContext): Promise<void> {
    const user: User = ctx.user;

    const format = (text: string): string => {
      if (typeof text === 'string') {
        text
          .slice(0, 3000)
          .replace(/`/g, `\`${String.fromCharCode(8203)}`)
          .replace(/@/g, `@${String.fromCharCode(8203)}`)
          .replace(new RegExp(process.env.TOKEN, 'gi'), '****');
      }

      return text;
    };

    let result: string;

    try {
      const option: string = ctx.interaction.options.getString('código', true);
      const evalued: any = await eval(option);

      result = format(util.inspect(evalued, { depth: 0 }));
    } catch (error) {
      this.logger.error('An error has been found: ', error);

      result = error.message!;
    }

    const code: string = codeBlock(result);

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

    if (result.length < 2e3) {
      await ctx.reply({
        content: code,
        components: [row]
      });
    } else {
      this.logger.info('Result from an eval: ', result);

      await ctx.reply({
        ephemeral: true,
        content: 'O resultado foi enviado diretamente para o painel.'
      });
    }

    const filter = (i: Interaction): boolean => i.user.id === this.client.config.ownerId;

    const collector: InteractionCollector<ButtonInteraction> = ctx.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter
    });

    collector.on('collect', async (target: CollectedInteraction<CacheType>): Promise<void> => {
      if (!target.deferred) await target.deferReply();

      switch (target.customId) {
        case 'trash':
          await ctx.interaction.deleteReply();
          await target.editReply({
            content: `<@${user.id}>, eval fechado com sucesso.`
          });

          break;
        default: break;
      }
    });
  }
}