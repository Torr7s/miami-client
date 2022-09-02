import { Interaction, InteractionResponse } from 'discord.js';

import { Command } from '@types';

import { Logger } from '@shared/utils/logger';
import { resolvePermissions } from '@shared/utils/discord/resolvables/permissions';

import { CommandContext, EventBase, MiamiClient } from '@structures/index';

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
   * @returns {Promise<InteractionResponse | void>} interaction | void 
   */
  async run(interaction: Interaction):  Promise<InteractionResponse | void> {
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
              const guildObj = { guildId: guild.id, ownerId: guild.ownerId };
              const userObj = { userId: user.id, guildId: guild.id };

              await this.client.guildsDb.findOne(guildObj) ?? await this.client.guildsDb.create(guildObj);
              await this.client.usersDb.findOne(userObj) ?? await this.client.usersDb.create(userObj);
            }

            const { appPerms, memberPerms } = command.permissions;

            if (appPerms && appPerms.length) {
              if (!interaction.appPermissions.has(appPerms)) {
                const { permissions } = resolvePermissions(appPerms);

                await interaction.reply({
                  ephemeral: true,
                  content: `Preciso das seguintes permissões para executar este comando: \n⤷ \`${permissions}\`.`
                });
                return;
              }
            }

            if (memberPerms && memberPerms.length) {
              if (!interaction.memberPermissions.has(memberPerms)) {
                const { permissions } = resolvePermissions(memberPerms);

                await interaction.reply({
                  ephemeral: true,
                  content: `Você precisa das seguintes permissões para executar este comando: \n⤷ \`${permissions}\`.`
                });
                return;
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

            if (clientCooldowns && clientCooldowns.has(user.id)) {
              const expiresAt: number = (clientCooldowns.get(user.id) as number) + commandCooldown;

              if (dateNow < expiresAt) {
                if (!interaction.deferred) {
                  await interaction.deferReply({
                    ephemeral: true,
                    fetchReply: true
                  });
                }

                const remainingTime: number = (expiresAt - dateNow) / 1e3;

                await interaction.editReply({
                  content: `
                    O comando \`${command.name}\` poderá ser utilizado novamente em \`${remainingTime.toFixed(1)}s\`.
                  `
                });
                return;
              }
            }

            if (clientCooldowns) {
              clientCooldowns.set(user.id, dateNow);

              setTimeout((): boolean => {
                return (
                  clientCooldowns.delete(user.id)
                )
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