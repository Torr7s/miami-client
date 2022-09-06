import { codeBlock, InteractionReplyOptions } from 'discord.js';

import CommandContext from '@structures/commandContext';

import { Embed } from '@shared/builders/embed';
import { formatTimestamp } from '@shared/utils/functions/time';

import { githubRequestHandler } from '..';

import { GithubUserProps } from '@types';

export const githubUsersHandler = async (ctx: CommandContext, user: string): Promise<InteractionReplyOptions> => {
  const res: GithubUserProps = await githubRequestHandler<GithubUserProps>(`users/${user}`);

  if (!res.id) {
    return ctx.reply({
      ephemeral: true,
      content: `
        Perfil não encontrado.
      `
    });
  }

  const description: string[] = [
    `${codeBlock(res.bio ?? 'Nenhuma biografia definida')}`,
    `:calendar_spiral: Criado em: ${formatTimestamp(res.created_at)}`,
    `:calendar_spiral: Última atualização: ${formatTimestamp(res.updated_at)}`
  ];

  const embed: Embed = new Embed(ctx.user)
    .setAuthor('Github Usuários')
    .setDescription(`${description.join('\n')}`)
    .setTitle(`Perfil de: ${res.login || res.name}`)
    .setThumbnail(`${res.avatar_url}`)
    .addField(':id: ID', `${res.id}`)
    .addField(':man_police_officer: Admin', `${res.site_admin ? 'Sim' : 'Não'}`)
    .addField(':bookmark_tabs: Repos públicos', `${res.public_repos}`)
    .addField(':busts_in_silhouette: Seguidores', `${res.followers}`)
    .addField(':yarn: Seguindo', `${res.following}`)
    .setURL(`${res.html_url}`);

  res.location && embed.addField(':map: Localização', `${res.location}`);
  res.email && embed.addField(':e_mail: Email', `${res.email}`);
  res.company && embed.addField(':tokyo_tower: Empresa', `${res.company}`)

  return ctx.reply({
    embeds: [
      embed.build()
    ]
  });
}