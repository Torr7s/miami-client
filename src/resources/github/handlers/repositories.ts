import { codeBlock, InteractionReplyOptions } from 'discord.js';

import githubRequester from '../requester';

import CommandContext from '@/src/structures/commandContext';
import EmbedComponent from '@/src/shared/components/embed';

import { formatTimestamp } from '@/src/shared/utils/functions/time';

export const githubRepositoriesHandler = async (ctx: CommandContext, repositoryOwner: string, repositoryName: string): Promise<InteractionReplyOptions> => {
  const res: GithubRepositoryProps = await githubRequester.get<
    GithubRepositoryProps
  >(`repos/${repositoryOwner}/${repositoryName}`);

  if (!res.id) {
    return ctx.reply({
      ephemeral: true,
      content: 'Repositório não encontrado.'
    });
  }

  const description: string[] = [
    `${codeBlock(res.description ?? 'Nenhuma descrição definida')}`,
    `:calendar_spiral: Criado em: ${formatTimestamp(res.created_at)}`,
    `:calendar_spiral: Última atualização: ${formatTimestamp(res.updated_at)}`
  ];

  const embed: EmbedComponent = new EmbedComponent(ctx.executor)
    .setAuthor('Github Repositórios')
    .setDescription(`${description.join('\n')}`)
    .setTitle(`Repositório: ${res.full_name}`)
    .setThumbnail(`${res.owner.avatar_url}`)
    .addField(':id: ID', `${res.id}`)
    .addField(':star: Estrelas', `${res.stargazers_count}`)
    .addField('<:branch:1011821342041059428> Branch', `${res.default_branch}`)
    .addField(':lock_with_ink_pen: Privado', `${res.private ? 'Sim' : 'Não'}`)
    .addField('<:code:1011776889364418671> Linguagem', `${res.language}`)
    .addField('<:fork:1011778046438670499> Forks', `${res.forks_count}`)
    .addField(':file_folder: Arquivado', `${res.archived ? 'Sim' : 'Não'}`)
    .addField(':boom: Desativado', `${res.disabled ? 'Sim' : 'Não'}`)
    .addField(':eyes: Visibilidade', `${res.visibility === 'public' ? 'Público' : 'Privado'}`)
    .addField(':busts_in_silhouette: Observadores', `${res.watchers}`)
    .addField(':nazar_amulet: Issues', `${res.open_issues_count}`)
    .setURL(res.html_url);

  if (res.license && res.license.name) {
    embed.addField(
      ':notebook: Licença',
      res.license.name
    );
  }

  return ctx.reply({ embeds: [embed.build()] });
}

interface GithubRepositoryProps {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    avatar_url: string;
  }
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    name: string;
  };
  visibility: string;
  default_branch: string;
  watchers: number;
}