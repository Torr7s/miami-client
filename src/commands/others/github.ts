import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

import CommandBase from '@structures/command';
import CommandContext from '@structures/commandContext';
import MiamiClient from '@structures/client';

import { githubRepositoriesHandler, githubUsersHandler } from '@subcmds/github';

/**
 * Represents a Github slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class GithubCommand extends CommandBase {
  client: MiamiClient;

  /**
   * @constructs GithubCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, {
      name: 'github',
      description: 'Obter informações do github',
      category: 'Others',
      options: [
        {
          name: 'usuários',
          nameLocalizations: {
            'en-US': 'users'
          },
          description: 'Dados de um usuário',
          descriptionLocalizations: {
            'en-US': 'A user data'
          },
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'usuário',
              nameLocalizations: {
                'en-US': 'user'
              },
              description: 'Nome de usuário',
              descriptionLocalizations: {
                'en-US': 'Username'
              },
              type: ApplicationCommandOptionType.String,
              required: true
            }
          ]
        },
        {
          name: 'repositórios',
          nameLocalizations: {
            'en-US': 'repositories'
          },
          description: 'Dados de um repositório',
          descriptionLocalizations: {
            'en-US': 'Repository data'
          },
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'usuário',
              nameLocalizations: {
                'en-US': 'user'
              },
              description: 'Dono do repositório',
              descriptionLocalizations: {
                'en-US': 'Repository owner username'
              },
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: 'repositório',
              nameLocalizations: {
                'en-US': 'repository'
              },
              description: 'Nome do repositório',
              descriptionLocalizations: {
                'en-US': 'Repository name'
              },
              type: ApplicationCommandOptionType.String,
              required: true
            }
          ]
        }
      ],
      permissions: {
        appPerms: [PermissionFlagsBits.EmbedLinks]
      }
    });

    this.client = client;
  }

  /**
   * Handle the incoming interaction as a command
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {Promise<void>} void
   */
  async run(ctx: CommandContext): Promise<void> {
    const subCommand: string = ctx.interaction.options.getSubcommand(true);

    switch (subCommand) {
      case 'repositórios':
      case 'repositories':
        const repoUser: string = ctx.interaction.options.getString('usuário');
        const repoName: string = ctx.interaction.options.getString('repositório');

        await githubRepositoriesHandler(ctx, repoUser, repoName);

        break;

      case 'usuários':
      case 'users':
        const user: string = ctx.interaction.options.getString('usuário');
        
        await githubUsersHandler(ctx, user);

        break;

      default: break;
    }
  }
}