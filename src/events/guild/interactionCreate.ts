import { Interaction, InteractionResponse, Message } from 'discord.js';

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
   * @returns {Promise<InteractionResponse<boolean> | void>} interaction | message | void 
   */
  async run(interaction: Interaction): Promise<InteractionResponse | Message | void> {
    try {
      const { user, guild } = interaction;

      if (guild.available) {
        if (interaction.isChatInputCommand()) {
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
              let mongoGUILD: GuildSchema = await this.client.guildsDb.findOne({ guildId: guild.id, ownerId: guild.ownerId });
              let mongoUSER: UserSchema = await this.client.usersDb.findOne({ userId: user.id, guildId: guild.id });

              if (!mongoGUILD) await this.client.guildsDb.create({ guildId: guild.id, ownerId: guild.ownerId });
              if (!mongoUSER) await this.client.usersDb.create({ userId: user.id, guildId: guild.id });
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
              if (!interaction.memberPermissions.has(memberPerms)) {
                const { permissions } = resolvePermissions(memberPerms);

                return interaction.reply({
                  ephemeral: true,
                  content: `Você precisa das seguintes permissões para executar este comando: \n⤷ \`${permissions}\`.`
                });
              }
            }

            if (!this.client.cooldowns.has(command.name)) {
              this.client.cooldowns.set(
                command.name,
                new Map<string, number>()
              );
            }

            const dateNow: number = Date.now();
            const commandCooldown: number = command.cooldown * 1e3;

            const clientCooldowns: Map<string, number> = this.client.cooldowns.get(command.name);

            if (clientCooldowns && clientCooldowns.has(command.name)) {
              const leftTime: number = (clientCooldowns.get(command.name) as number) * commandCooldown; 
            
              if (dateNow < leftTime) {
                const remainingTime: number = (leftTime - dateNow) / 1e3;

                if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });

                return interaction.editReply({ 
                  content: `
                    Este comando poderá ser executado novamente em \`${remainingTime.toFixed(1)}s\`, aguarde.
                  `
                });
              }
            }

            if (clientCooldowns) {
              clientCooldowns.set(command.name, dateNow);

              setTimeout((): void => {
                clientCooldowns.set(command.name, dateNow);
              }, commandCooldown);
            }

            const context: CommandContext = new CommandContext(this.client, interaction);

            command.run(context);
          }
        }
      }
    } catch (error) {
      this.logger.error('Um erro foi encontrado: ', error);
    }
  }
}