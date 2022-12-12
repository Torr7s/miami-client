import {
  ApplicationCommandOptionType,
  GuildEmoji,
  InteractionReplyOptions,
  PermissionFlagsBits
} from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import { Logger } from '@/src/shared/utils/logger';

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

  /**
   * Handle the incoming interaction as a command
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {Promise<InteractionReplyOptions | void>} options - The given options for ctx
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions | void> {
    const attachment: string = ctx.interaction.options.getString('anexo', true);
    const name: string = ctx.interaction.options.getString('nome', true);

    if (ctx.guild.emojis.cache.size >= this.guildEmojisPerBoostLevel[ctx.guild.premiumTier]) {
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

      ctx.reply({
        content: `
          O emoji ${emoji} foi criado com sucesso. 
        `
      });
    } catch (error) {
      this.logger.error(`An error has been found: `, error.message);

      if (error.message!.includes('Asset exceeds maximum size')) {
        return ctx.reply({
          ephemeral: true,
          content: `
            O anexo fornecido é maior do que 256kb.
          `
        });
      }

      ctx.reply({
        ephemeral: true,
        content: `
          Erro encontrado ao tentar criar emoji: \`${error.message!}\`
        `
      });
    }
  }
}