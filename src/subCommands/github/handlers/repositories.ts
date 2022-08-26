import { codeBlock, InteractionReplyOptions } from 'discord.js';

import { CommandContext } from '@structures/commandContext';

import { Embed } from '@shared/builders/embed';
import { formatTimestamp } from '@shared/utils/functions/time';

import { githubRequestHandler } from '..';

import { GithubRepositoryProps } from '@types';

export const githubRepositoriesHandler = async (ctx: CommandContext, repoUser: string, repoName: string): Promise<InteractionReplyOptions> => {
  const res: GithubRepositoryProps = await githubRequestHandler<GithubRepositoryProps>(`repos/${repoUser}/${repoName}`);

  if (!res.id) {
    return ctx.reply({
      ephemeral: true,
      content: `
        Repositório não encontrado.
      `
    });
  }

  const description: string[] = [
    `${codeBlock(res.description ?? 'Nenhuma descrição definida')}`,
    `:calendar_spiral: Criado em: ${formatTimestamp(res.created_at)}`,
    `:calendar_spiral: Última atualização: ${formatTimestamp(res.updated_at)}`
  ];

  const embed: Embed = new Embed(ctx.user, {
    author: {
      name: `
        Github Repositórios
      `
    },
    title: `Repositório: ${res.full_name}`,
    thumbnail: {
      url: res.owner.avatar_url
    },
    description: description.join('\n'),
    fields: [
      { 
        name: ':id: ID', 
        value: `${res.id}`, 
        inline: true 
      },
      {
        name: ':star: Estrelas',
        value: `${res.stargazers_count}`,
        inline: true
      },
      {
        name: '<:branch:1011821342041059428> Branch',
        value: `${res.default_branch}`,
        inline: true
      },
      { 
        name: ':lock_with_ink_pen: Privado', 
        value: `${res.private ? 'Sim' : 'Não'}`, 
        inline: true 
      },
      { 
        name: '<:code:1011776889364418671> Linguagem', 
        value: `${res.language}`, 
        inline: true 
      },
      { 
        name: '<:fork:1011778046438670499> Forks', 
        value: `${res.forks_count}`, 
        inline: true 
      },
      { 
        name: ':file_folder: Arquivado', 
        value: `${res.archived ? 'Sim' : 'Não'}`, 
        inline: true 
      },
      { 
        name: ':boom: Desativado', 
        value: `${res.disabled ? 'Sim' : 'Não'}`, 
        inline: true 
      },
      {
        name: ':eyes: Visibilidade',
        value: `${res.visibility === 'public' ? 'Público' : 'Privado'}`,
        inline: true
      },
      {
        name: ':busts_in_silhouette: Observadores',
        value: `${res.watchers}`,
        inline: true
      },
      {
        name: ':nazar_amulet: Issues',
        value: `${res.open_issues_count}`,
        inline: true
      }
    ],
    url: res.html_url
  });

  if (res.license && res.license.name) {
    embed.addFields([
      {
        name: ':notebook: Licença',
        value: `${res.license.name}`,
        inline: true
      }
    ]);
  }

  return ctx.reply({
    embeds: [
      embed
    ]
  });
}