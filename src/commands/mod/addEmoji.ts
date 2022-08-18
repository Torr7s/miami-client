import { ApplicationCommandOptionType, GuildEmoji, InteractionReplyOptions, PermissionFlagsBits } from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { Logger } from '@shared/utils/logger';

export default class AddEmojiCommand extends CommandBase {
  private readonly guildEmojisPerBoostLevel = {
    0: 50,
    1: 100,
    2: 150,
    3: 250
  }
  private readonly logger: Logger;

  client: MiamiClient;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'addemoji',
      description: 'Adicionar emoji ao servidor',
      category: 'Mod',
      options: [
        {
          name: 'anexo',
          nameLocalizations: {
            "en-US": 'asset'
          },
          description: 'O anexo do emoji (URL)',
          descriptionLocalizations: {
            "en-US": 'The emoji asset (URL)'
          },
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'nome',
          nameLocalizations: {
            'en-US': 'name'
          },
          description: 'Nome do emoji',
          descriptionLocalizations: {
            'en-US': 'The emoji name'
          },
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
      permissions: {
        appPerms: [PermissionFlagsBits.ManageEmojisAndStickers],
        memberPerms: [PermissionFlagsBits.ManageEmojisAndStickers]
      }
    });

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }

  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const attachment: string = ctx.interaction.options.getString('anexo', true);
    const name: string = ctx.interaction.options.getString('nome', true);

    if (ctx.guild.emojis.cache.size >= this.guildEmojisPerBoostLevel[ctx.guild.premiumTier]) {
      return ctx.reply({
        ephemeral: true,
        content: `O servidor não possui mais slots disponíveis para emojis.`
      });
    }

    let content: string;

    try {
      const emoji: GuildEmoji = await ctx.guild.emojis.create({
        attachment,
        name
      });

      content = `O emoji ${emoji} foi criado com sucesso.`
    } catch (error) {
      this.logger.error(`An error has been found: `, error.message);

      content = error.message!;
    }

    return ctx.reply({
      ephemeral: true,
      content
    });
  }
}