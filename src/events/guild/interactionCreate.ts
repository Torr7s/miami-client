import { Interaction, InteractionResponse } from 'discord.js';

import CommandContext from '@/src/structures/commandContext';
import EventBase from '@/src/structures/event';
import MiamiClient from '@/src/structures/client';

import { Command } from '@/src/typings';

import { Logger } from '@/src/shared/utils/logger';
import { resolvePermissions } from '@/src/shared/utils/discord/resolvables/permissions';

export default class InteractionCreateEvent extends EventBase {
  public client: MiamiClient;
  private readonly logger: Logger;

  constructor(client: MiamiClient) {
    super(client, 'interactionCreate');

    this.client = client;
    this.logger = Logger.it(this.constructor.name);
  }

  public async run(interaction: Interaction): Promise<InteractionResponse | void> {
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
                  content: 'Comando restrito.'
                });
              }
            }

            if (command.requiresDatabase?.guild) {
              await this.client.guildsDb.findOrCreate(guild.id);

              // ...
            } else if (command.requiresDatabase?.user) {
              await this.client.usersDb.findOrCreate(
                guild.id,
                user.id
              );
            }

            const { appPerms, memberPerms } = command.permissions;

            if (appPerms && appPerms.length) {
              const clientHasPermissions: boolean = interaction.appPermissions.has(appPerms);

              if (!clientHasPermissions) {
                const { permissions } = resolvePermissions(appPerms);

                return interaction.reply({
                  ephemeral: true,
                  content: `Preciso das seguintes permissões para executar este comando: \n⤷ \`${permissions}\`.`
                });
              }
            }

            if (memberPerms && memberPerms.length) {
              const memberHasPermissions: boolean = interaction.memberPermissions.has(memberPerms);

              if (!memberHasPermissions) {
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
                  content: `O comando \`${command.name}\` poderá ser utilizado novamente em \`${remainingTime.toFixed(1)}s\`.`
                });
                return;
              }
            }

            if (clientCooldowns) {
              clientCooldowns.set(
                user.id, 
                dateNow
              );

              setTimeout((): boolean => clientCooldowns.delete(user.id), commandCooldown);
            }

            const context: CommandContext = new CommandContext(
              this.client, 
              interaction
            );

            command.run(context);
          }
        }
      }
    } catch (error) {
      this.logger.error('Um erro foi encontrado: ', error);
    }
  }
}