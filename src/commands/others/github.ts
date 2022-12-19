import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

import CommandBase from '@/src/structures/command';
import CommandContext from '@/src/structures/commandContext';
import MiamiClient from '@/src/structures/client';

import { githubRepositoriesHandler } from '@/src/resources/github/handlers/repositories';
import { githubUsersHandler } from '@/src/resources/github/handlers/users';

export default class GithubCommand extends CommandBase {
  public client: MiamiClient;

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

  public async run(ctx: CommandContext): Promise<void> {
    const subCommand: string = ctx.interaction.options.getSubcommand(true);

    if (subCommand == 'repositórios') {
      const repoUser: string = ctx.interaction.options.getString('usuário');
      const repoName: string = ctx.interaction.options.getString('repositório');

      await githubRepositoriesHandler(ctx, repoUser, repoName);
    } else if (subCommand == 'usuários') {
      const user: string = ctx.interaction.options.getString('usuário');

      await githubUsersHandler(ctx, user);
    }
  }
}