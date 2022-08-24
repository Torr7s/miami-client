import { InteractionReplyOptions } from 'discord.js';

import { CommandContext } from '@structures/commandContext';

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
    `\`\`\`${res.bio ?? 'Nenhuma biografia definida'}\`\`\``,
    `:calendar_spiral: Criado em: \`${formatTimestamp(res.created_at)}\``,
    `:calendar_spiral: Última atualização: \`${formatTimestamp(res.updated_at)}\``
  ];

  const embed: Embed = new Embed(ctx.user, {
    author: {
      name: `
        Github Usuários
      `
    },
    title: `Perfil de: ${res.login || res.name}`,
    thumbnail: {
      url: res.avatar_url
    },
    description: description.join('\n'),
    fields: [
      {
        name: ':id: ID',
        value: `${res.id}`,
        inline: true
      },
      {
        name: ':man_police_officer: Admin',
        value: `${res.site_admin ? 'Sim' : 'Não'}`,
        inline: true
      },
      {
        name: ':bookmark_tabs: Repos públicos',
        value: `${res.public_repos}`,
        inline: true
      },
      {
        name: ':busts_in_silhouette: Seguidores',
        value: `${res.followers}`,
        inline: true
      },
      {
        name: ':yarn: Seguindo',
        value: `${res.following}`,
        inline: true
      },
      {
        name: ':date: Conta criada em',
        value: `${formatTimestamp(res.created_at)}`,
        inline: true
      },
      {
        name: ':date: Conta atualizada em',
        value: `${formatTimestamp(res.updated_at)}`,
        inline: true
      }
    ],
    url: res.html_url
  });

  if (res.location) {
    embed.addFields([
      {
        name: ':map: Localização',
        value: `${res.location}`,
        inline: true
      }
    ]);
  }

  if (res.email) {
    embed.addFields([
      {
        name: ':e_mail: email',
        value: `${res.email}`,
        inline: true
      }
    ]);
  }

  if (res.company) {
    embed.addFields([
      {
        name: ':tokyo_tower: Empresa',
        value: `${res.company}`,
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