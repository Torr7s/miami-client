import { ApplicationCommandOptionType, GuildEmoji, InteractionReplyOptions, PermissionFlagsBits } from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { Logger } from '@shared/utils/logger';

/**
 * Represents an AddEmoji slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {Object} guildEmojisPerBoostLevel - The number of emojis allowed per guild boost level
 * @prop {Logger} logger - The command logger
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class AddEmojiCommand extends CommandBase {
  private readonly guildEmojisPerBoostLevel = {
    0: 50,
    1: 100,
    2: 150,
    3: 250
  }
  private readonly logger: Logger;

  client: MiamiClient;

  /**
   * @constructs AddEmojiCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
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
   * @returns {InteractionReplyOptions} options - The given options for ctx
   */
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