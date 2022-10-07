import { codeBlock, InteractionReplyOptions } from 'discord.js';

import CommandContext from '@/src/structures/commandContext';

import { Embed } from '@/src/shared/builders/embed';
import { formatTimestamp } from '@/src/shared/utils/functions/time';

import { githubRequestHandler } from '..';

import { GithubRepositoryProps } from '@/src/typings';

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

  const embed: Embed = new Embed(ctx.user)
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
    .setURL(res.html_url)

  if (res.license && res.license.name) embed.addField(':notebook: Licença', `${res.license.name}`);

  return ctx.reply({
    embeds: [
      embed.build() 
    ]
  });
}