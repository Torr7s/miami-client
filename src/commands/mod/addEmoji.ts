import {
  ApplicationCommandOptionType,
  codeBlock,
  DiscordAPIError,
  GuildEmoji,
  InteractionReplyOptions,
  PermissionFlagsBits
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import { Logger } from '@/src/shared/utils/logger';

export default class AddEmojiCommand extends CommandBase {
  public client: MiamiClient;
  private readonly logger: Logger;

  constructor(client: MiamiClient) {
    super(client, {
      name: 'addemoji',
      description: 'Adicionar emoji ao servidor',
      category: 'Mod',
      options: [
        {
          name: 'anexo',
          nameLocalizations: {
            'en-US': 'asset'
          },
          description: 'O anexo do emoji (URL)',
          descriptionLocalizations: {
            'en-US': 'The emoji asset (URL)'
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

  public async run(ctx: CommandContext): Promise<InteractionReplyOptions|void> {
    const attachment: string = ctx.interaction.options.getString('anexo', true);
    const name: string = ctx.interaction.options.getString('nome', true);

    const guildEmojisPerBoostLevel = {
      0: 50,
      1: 100,
      2: 150,
      3: 250
    }

    if (ctx.guild.emojis.cache.size >= guildEmojisPerBoostLevel[ctx.guild.premiumTier]) {
      return ctx.reply({
        ephemeral: true,
        content: `O servidor não possui mais slots disponíveis para emojis.`
      });
    }

    try {
      const emoji: GuildEmoji = await ctx.guild.emojis.create({
        attachment,
        name
      });

      return ctx.reply({
        ephemeral: true,
        content: `O emoji ${emoji} foi criado com sucesso.`
      });
    } catch (error) {
      this.logger.error(`An error has been found while trying to create an emoji: `, error);

      if ((error as DiscordAPIError).message == 'Asset exceeds maximum size: 33554432') {
        return ctx.reply({
          ephemeral: true,
          content: 'O anexo fornecido é maior do que 256kb.'
        });
      }

      return ctx.reply({
        ephemeral: true,
        content: `Erro encontrado ao tentar criar emoji: ${codeBlock(error.message!)}`
      });
    }
  }
}