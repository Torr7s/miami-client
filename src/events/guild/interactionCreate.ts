import { Interaction, InteractionResponse } from 'discord.js';

import { Command } from '@types';

import { Logger } from '@shared/utils/logger';
import { resolvePermissions } from '@shared/utils/discord/resolvables/permissions';

import { CommandContext, EventBase, MiamiClient } from '@structures/index';

import { GuildSchema } from '@shared/database/models/guild';
import { UserSchema } from '@shared/database/models/user';

/**
 * Represents a InteractionCreate client event
 * 
 * @class @extends EventBase
 * @classdesc Emitted whenever a interaction is created
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class InteractionCreateEvent extends EventBase {
  private readonly logger: Logger;

  client: MiamiClient;

  /**
   * @constructs InteractionCreateEvent
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, 'interactionCreate');

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }

  /**
   * Used to handle created interactions
   * 
   * @public @method @async
   * 
   * @param {Interaction} interaction - The created interaction
   * 
   * @returns {Promise<InteractionResponse<boolean> | void>} interaction | void 
   */
  async run(interaction: Interaction): Promise<InteractionResponse<boolean> | void> {
    try {
      const { user, guild } = interaction;

      if (interaction.guild && interaction.isChatInputCommand()) {
        const command: Command = this.client.commands.find((cmd: Command): boolean => cmd.name === interaction.commandName);

        if (command) {
          if (command.category === 'Dev' || command.restricted) {
            if (interaction.user.id !== this.client.config.ownerId) {
              return interaction.reply({
                ephemeral: true,
                content: `Comando restrito.`
              });
            }
          }

          if (command.requiresDatabase) {
            if (interaction.guild.available) {
              let mongoGUILD: GuildSchema = await this.client.guildsDb.findOne({ guildId: guild.id, ownerId: guild.ownerId });
              let mongoUSER: UserSchema = await this.client.usersDb.findOne({ userId: user.id, guildId: guild.id });
        
              if (!mongoGUILD) await this.client.guildsDb.create({ guildId: guild.id, ownerId: guild.ownerId });
              if (!mongoUSER) await this.client.usersDb.create({ userId: user.id, guildId: guild.id }); 
            }
          }

          const { appPerms, memberPerms } = command.permissions;

          if (appPerms && appPerms.length) {
            if (!interaction.appPermissions.has(appPerms)) {
              const { permissions } = resolvePermissions(appPerms);
  
              return interaction.reply({
                ephemeral: true,
                content: `Preciso das seguintes permissões para executar este comando: \n⤷ \`${permissions}\`.`
              });
            }
          }
  
          if (memberPerms && memberPerms.length) {
            if(!interaction.memberPermissions.has(memberPerms)) {
              const { permissions } = resolvePermissions(memberPerms);
  
              return interaction.reply({
                ephemeral: true,
                content: `Você precisa das seguintes permissões para executar este comando: \n⤷ \`${permissions}\`.`
              });
            }
          }
  
          const context: CommandContext = new CommandContext(this.client, interaction);
    
          command.run(context);
        }
      }
    } catch (error) {
      this.logger.error('Um erro foi encontrado: ', error);
    }
  }
}